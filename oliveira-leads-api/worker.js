// worker.js — Oliveira Imóveis Leads API
var NTFY_TOPIC = "oliveira-imoveis-leads-2026";
var ADMIN_SECRET = "oli2026admin";
var NOTION_DB_ID = "527c3cfd-45fc-41fe-8193-5ebd7d57ce83";

function normalizeSegmento(raw) {
  if (!raw) return null;
  const s = raw.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  if (s.includes("odonto") || s.includes("dentist") || s.includes("ortodont")) return "Odontologia";
  if (s.includes("estetica") || s.includes("beleza") || s.includes("harmoniz") || s.includes("dermato")) return "Estética";
  if (s.includes("pilates") || s.includes("fisioterapia") || s.includes("fisio")) return "Pilates / Fisioterapia";
  if (s.includes("longevidade") || s.includes("geriatr") || s.includes("idoso")) return "Longevidade / Geriatria";
  if (s.includes("nutri") || s.includes("bem-estar") || s.includes("bem estar") || s.includes("integrativa") || s.includes("saude") || s.includes("spa")) return "Saúde e bem-estar";
  if (s.includes("pet") || s.includes("veterin") || s.includes("animal")) return "Pet Shop / Veterinário";
  if (s.includes("psicolog") || s.includes("terapia")) return "Psicologia";
  if (s.includes("academia") || s.includes("fitness") || s.includes("gym") || s.includes("musculac")) return "Academia / Fitness";
  if (s.includes("aliment") || s.includes("restaur") || s.includes("cafe") || s.includes("lanche")) return "Alimentação";
  return "Outros";
}

function getOrigem(pagina) {
  if (!pagina) return "LP1 — Pesquisa Estratégica";
  const p = pagina.toLowerCase();
  if (p.includes("portofino") || p.includes("loja16")) return "LP2 — Portofino Street Mall";
  if (p.includes("pesquisa") || p.includes("organico")) return "Orgânico";
  return "LP1 — Pesquisa Estratégica";
}

async function createNotionLead(lead, notionToken) {
  // schema do banco novo "CRM — Leads Oliveira Imóveis" (recriado 08/07/2026 em MVP Oliveira)
  const rt = (v) => ({ rich_text: [{ text: { content: String(v) } }] });
  const has = (v) => v && v !== "-" && !String(v).startsWith("sem_");
  const props = {
    "Nome": { title: [{ text: { content: lead.nome || "Lead sem nome" } }] },
    "Fase": { select: { name: "Novo lead" } },
    "Página de Origem": rt(lead.pagina_origem || "-"),
  };
  if (lead.telefone && lead.telefone !== "via WhatsApp" && lead.telefone !== "-")
    props["Telefone"] = { phone_number: lead.telefone };
  if (lead.email && lead.email !== "-")
    props["Email"] = { email: lead.email };
  const segmento = normalizeSegmento(lead.segmento);
  if (segmento && has(lead.segmento)) props["Segmento"] = { select: { name: segmento } };
  if (has(lead.utm_source)) props["UTM Source"] = rt(lead.utm_source);
  if (has(lead.utm_medium)) props["UTM Medium"] = rt(lead.utm_medium);
  if (has(lead.utm_campaign)) props["UTM Campaign"] = rt(lead.utm_campaign);
  if (has(lead.utm_id)) props["UTM ID"] = rt(lead.utm_id);
  const botaoClicado = has(lead.botao_clicado) ? lead.botao_clicado : lead.utm_content;
  if (has(botaoClicado)) props["Botão Clicado (UTM Content)"] = rt(botaoClicado);
  if (has(lead.conjunto_anuncios)) props["Conjunto de Anúncios"] = rt(lead.conjunto_anuncios);
  if (has(lead.adset_id)) props["Adset ID"] = rt(lead.adset_id);
  if (has(lead.anuncio)) props["Anúncio"] = rt(lead.anuncio);
  if (has(lead.ad_id)) props["Ad ID"] = rt(lead.ad_id);
  if (has(lead.placement)) props["Placement"] = rt(lead.placement);
  if (has(lead.fbclid)) props["FBCLID"] = rt(lead.fbclid);

  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${notionToken}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({ parent: { database_id: NOTION_DB_ID }, properties: props }),
  });
  if (!res.ok) {
    const errText = await res.text();
    console.error("Notion error:", errText);
    return errText;
  }
  return null;
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

      if (env.NOTION_TOKEN) {
        const notionErr = await createNotionLead(lead, env.NOTION_TOKEN).catch((e) => String(e));
        if (notionErr) await env.LEADS.put("notion:last_error", `${new Date().toISOString()} ${notionErr}`).catch(() => {});
      }

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
