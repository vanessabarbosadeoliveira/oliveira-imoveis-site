/**
 * oliveira-ga4-api — Cloudflare Worker
 *
 * Expõe os dados do GA4 (propriedade Oliveira Imóveis) via HTTP simples,
 * autenticando com uma conta de serviço do Google (Service Account) em vez
 * de depender de login OAuth interativo. Isso resolve o problema documentado
 * na skill marketing-oliveira: o acesso ao GA4 via MCP/Claude in Chrome não
 * é confiável em execuções automáticas/agendadas.
 *
 * Endpoints:
 *   GET /report?secret=...&desde=YYYY-MM-DD&ate=YYYY-MM-DD
 *     -> resumo (usuários, sessões, eventos principais, tempo médio) +
 *        tabela de aquisição por Origem/Mídia (sessões, eventos principais)
 *
 *   GET /realtime?secret=...
 *     -> contagem de eventos nos últimos 30 min (equivalente ao GA4 Realtime)
 *
 * Segredos necessários (configurar com `wrangler secret put <nome>`,
 * NUNCA colar a chave direto no código ou no wrangler.jsonc):
 *   - GA4_SA_EMAIL         → client_email da conta de serviço
 *   - GA4_SA_PRIVATE_KEY   → private_key da conta de serviço (com \n literais)
 *   - GA4_PROPERTY_ID      → "538068487"
 *   - API_SECRET           → senha simples pra proteger o endpoint (escolha a sua)
 */

const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.searchParams.get("secret") !== env.API_SECRET) {
      return json({ error: "unauthorized" }, 401);
    }

    try {
      const accessToken = await getAccessToken(env);

      if (url.pathname === "/report") {
        const desde = url.searchParams.get("desde");
        const ate = url.searchParams.get("ate");
        if (!desde || !ate) {
          return json({ error: "parâmetros 'desde' e 'ate' são obrigatórios (YYYY-MM-DD)" }, 400);
        }
        const data = await buildReport(env, accessToken, desde, ate);
        return json(data);
      }

      if (url.pathname === "/realtime") {
        const data = await runRealtimeReport(env, accessToken);
        return json(data);
      }

      return json({ error: "not found", endpoints: ["/report", "/realtime"] }, 404);
    } catch (err) {
      return json({ error: String(err && err.message ? err.message : err) }, 500);
    }
  },
};

// ---------- Relatório principal ----------

async function buildReport(env, accessToken, desde, ate) {
  const [summary, acquisition] = await Promise.all([
    runReport(env, accessToken, {
      dateRanges: [{ startDate: desde, endDate: ate }],
      metrics: [
        { name: "activeUsers" },
        { name: "newUsers" },
        { name: "sessions" },
        { name: "averageSessionDuration" },
        { name: "keyEvents" },
      ],
    }),
    runReport(env, accessToken, {
      dateRanges: [{ startDate: desde, endDate: ate }],
      dimensions: [{ name: "sessionSource" }, { name: "sessionMedium" }],
      metrics: [{ name: "sessions" }, { name: "keyEvents" }, { name: "totalRevenue" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: "25",
    }),
  ]);

  const s = summary.rows && summary.rows[0] ? summary.rows[0].metricValues.map((m) => m.value) : ["0", "0", "0", "0", "0"];

  return {
    periodo: { desde, ate },
    resumo: {
      usuarios_ativos: Number(s[0] || 0),
      novos_usuarios: Number(s[1] || 0),
      sessoes: Number(s[2] || 0),
      tempo_medio_engajamento_s: Number(s[3] || 0),
      eventos_principais: Number(s[4] || 0),
    },
    aquisicao: (acquisition.rows || []).map((row) => ({
      origem: row.dimensionValues[0].value,
      midia: row.dimensionValues[1].value,
      sessoes: Number(row.metricValues[0].value || 0),
      eventos_principais: Number(row.metricValues[1].value || 0),
      receita: Number(row.metricValues[2].value || 0),
    })),
  };
}

async function runRealtimeReport(env, accessToken) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${env.GA4_PROPERTY_ID}:runRealtimeReport`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "eventCount" }, { name: "keyEvents" }],
      }),
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(`GA4 realtime API ${res.status}: ${JSON.stringify(data)}`);
  return {
    janela: "últimos 30 min (rolante)",
    eventos: (data.rows || []).map((row) => ({
      evento: row.dimensionValues[0].value,
      contagem: Number(row.metricValues[0].value || 0),
      eventos_principais: Number(row.metricValues[1].value || 0),
    })),
  };
}

async function runReport(env, accessToken, body) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${env.GA4_PROPERTY_ID}:runReport`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(`GA4 API ${res.status}: ${JSON.stringify(data)}`);
  return data;
}

// ---------- Autenticação via conta de serviço (JWT assertion) ----------

async function getAccessToken(env) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claims = {
    iss: env.GA4_SA_EMAIL,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  };

  const signingInput = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(claims))}`;
  const key = await importPrivateKey(env.GA4_SA_PRIVATE_KEY);
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(signingInput)
  );
  const jwt = `${signingInput}.${b64urlFromBuffer(signature)}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`token exchange falhou: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function importPrivateKey(pem) {
  const normalized = pem.includes("\\n") ? pem.replace(/\\n/g, "\n") : pem;
  const body = normalized
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s/g, "");
  const der = Uint8Array.from(atob(body), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey(
    "pkcs8",
    der.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

function b64url(str) {
  return b64urlFromBuffer(new TextEncoder().encode(str));
}

function b64urlFromBuffer(buf) {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
