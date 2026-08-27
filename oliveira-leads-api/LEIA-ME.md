# oliveira-leads-api — correção do CRM Notion (2026-07-20)

Worker que recebe os leads das LPs, guarda no KV (painel), notifica via ntfy e cria página no Notion.

## O que foi corrigido neste worker.js
1. `NOTION_DB_ID` atualizado para o banco NOVO "CRM — Leads Oliveira Imóveis" (527c3cfd-45fc-41fe-8193-5ebd7d57ce83), dentro de 🏠 MVP Oliveira. O antigo (c733bd65...) foi apagado.
2. `createNotionLead` reescrita para o esquema do banco novo: Telefone, Email, Fase "Novo lead", Segmento, UTMs, Conjunto de Anúncios, Adset ID, Anúncio, Ad ID, Placement, FBCLID, Página de Origem.
3. Erros do Notion agora ficam registrados no KV (chave `notion:last_error`) para diagnóstico.

## Para publicar (no Terminal)
```bash
cd "$HOME/Documents/Claude/Projects/site oliveira/oliveira-leads-api"
npx wrangler deploy
```
(usa o login OAuth do wrangler já salvo; preserva KV, painel e o secret NOTION_TOKEN)

## Depois do deploy
Pedir ao Claude para "testar o lead do Notion" — ele envia um lead de teste e confere se a página aparece no CRM.
Se não aparecer: abrir o banco "CRM — Leads Oliveira Imóveis" no Notion → ••• → Connections → adicionar a integração do NOTION_TOKEN.
