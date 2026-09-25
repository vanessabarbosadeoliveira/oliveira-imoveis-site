// worker.js — Oliveira Imóveis Leads API
var NTFY_TOPIC = "oliveira-imoveis-leads-2026";
var ADMIN_SECRET = "oli2026admin";
// Pipeline novo (n8n -> Chatwoot -> Loft), substitui o envio pro Notion
// a partir de 25/09/2026 (pedido da Vanessa: "nao precisa mais enviar pro
// Notion, agora so precisa enviar pra Loft atraves do n8n"). Token de
// webhook e só um "não deixe qualquer um chamar esse endpoint", não é
// segredo de Loft/Chatwoot/Postgres (ver docs/site-integration.md do
// projeto oliveira-intelligence-platform) — mesmo padrão de secret
// hardcoded já usado neste arquivo (NTFY_TOPIC/ADMIN_SECRET acima).
var N8N_WEBHOOK_URL = "https://n8n.oliveiraimoveis.ia.br/webhook/website-lead-ingress";
var N8N_WEBHOOK_TOKEN = "1eee630a604241944a48733a869b59457a45023e79265e30";

async function forwardToN8n(lead) {
  // Contrato canônico de docs/site-integration.md (workflow 00_website_lead_ingress.json).
  const payload = {
    nome: lead.nome || "",
    telefone: lead.telefone || "",
    email: lead.email && lead.email !== "-" ? lead.email : undefined,
    imovel_id: lead.imovel_id || undefined,
    imovel_codigo: lead.imovel_codigo || lead.segmento || undefined,
    origem: "landing_page",
    submission_id: lead.event_id || lead.id,
    utm_source: lead.utm_source || undefined,
    utm_medium: lead.utm_medium || undefined,
    utm_campaign: lead.utm_campaign || undefined,
    utm_content: lead.utm_content || lead.botao_clicado || undefined,
    utm_term: lead.utm_term || undefined,
    gclid: lead.gclid || undefined,
    fbclid: lead.fbclid && lead.fbclid !== "sem_fbclid" ? lead.fbclid : undefined,
    pagina_origem: lead.pagina_origem || undefined,
    url_origem: lead.event_source_url || undefined,
  };
  try {
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Oliveira-Webhook-Token": N8N_WEBHOOK_TOKEN },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return await res.text();
    return null;
  } catch (e) {
    return String(e);
  }
}

var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method;
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    if (method === "POST" && url.pathname === "/lead") {
      let data = {};
      const ct = request.headers.get("Content-Type") || "";
      if (ct.includes("application/json")) {
        data = await request.json().catch(() => ({}));
      } else {
        const form = await request.formData().catch(() => null);
        if (form) for (const [k, v] of form.entries()) { if (!k.startsWith("_")) data[k] = v; }
      }

      if (!data.nome && !data.email && !data.telefone) {
        return new Response(JSON.stringify({ success: false, error: "Dados insuficientes" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      const lead = { id, timestamp: new Date().toISOString(), ...data };

      await env.LEADS.put(`lead:${id}`, JSON.stringify(lead));

      const msg = [
        `🏢 Novo lead Oliveira Imóveis`,
        `Nome: ${data.nome || "-"}`, `Tel: ${data.telefone || "-"}`,
        `Email: ${data.email || "-"}`, `Segmento: ${data.segmento || "-"}`,
        `Campanha: ${data.utm_campaign || "-"}`, `Criativo: ${data.anuncio || "-"}`,
        `Página: ${data.pagina_origem || "-"}`
      ].join("\n");

      await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
        method: "POST",
        headers: { "Content-Type": "text/plain", Title: "Novo Lead - Oliveira Imóveis", Priority: "high", Tags: "house,bell" },
        body: msg
      }).catch(() => {});

      const n8nErr = await forwardToN8n(lead).catch((e) => String(e));
      if (n8nErr) await env.LEADS.put("n8n:last_error", `${new Date().toISOString()} ${n8nErr}`).catch(() => {});

      return new Response(JSON.stringify({ success: true, id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (method === "GET" && url.pathname === "/leads") {
      if (url.searchParams.get("secret") !== ADMIN_SECRET)
        return new Response("Não autorizado", { status: 401 });
      const list = await env.LEADS.list({ prefix: "lead:" });
      const leads = await Promise.all(list.keys.map(async (k) => {
        const raw = await env.LEADS.get(k.name);
        return raw ? JSON.parse(raw) : null;
      }));
      const rows = leads.filter(Boolean).sort((a, b) => b.timestamp.localeCompare(a.timestamp)).map(
        (l) => `<tr>
          <td>${new Date(l.timestamp).toLocaleString("pt-BR")}</td>
          <td>${l.nome || "-"}</td><td>${l.telefone || "-"}</td><td>${l.email || "-"}</td>
          <td>${l.segmento || "-"}</td><td>${l.utm_campaign || "-"}</td>
          <td>${l.conjunto_anuncios || "-"}</td><td>${l.anuncio || "-"}</td>
          <td>${l.pagina_origem || "-"}</td></tr>`
      ).join("");
      const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8">
<title>Leads — Oliveira Imóveis</title>
<style>body{font-family:system-ui,sans-serif;padding:1rem;background:#f5f5f5}h1{color:#1a1a2e}
table{width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.1)}
th{background:#1a1a2e;color:#fff;padding:.75rem .5rem;text-align:left;font-size:.8rem}
td{padding:.65rem .5rem;border-bottom:1px solid #eee;font-size:.85rem}</style></head>
<body><h1>🏢 Leads — Oliveira Imóveis</h1>
<p>${leads.filter(Boolean).length} leads registrados</p>
<table><thead><tr><th>Data/Hora</th><th>Nome</th><th>Telefone</th><th>Email</th>
<th>Segmento</th><th>Campanha</th><th>Conjunto</th><th>Criativo</th><th>Página</th></tr></thead>
<tbody>${rows || "<tr><td colspan='9' style='text-align:center;padding:2rem;color:#999'>Nenhum lead ainda</td></tr>"}</tbody>
</table></body></html>`;
      return new Response(html, { headers: { "Content-Type": "text/html;charset=utf-8" } });
    }

    return new Response("Not found", { status: 404 });
  }
};

export { worker_default as default };
