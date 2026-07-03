---
name: lp1-lp2-oliveira
description: Landing pages Portofino Buritis (LP1 "Pesquisa Estratégica" + LP2 "Portofino Street Mall") — tracking GA4/Meta Pixel/painel de leads, workers Cloudflare, pendências conhecidas. Carregar sempre que mexer em LP1, LP2, tracking de lead, GA4/Meta da campanha Portofino ou nos workers oliveira-pesquisa/wispy-field-ab1d/oliveira-leads-api.
---

# LP1 / LP2 Oliveira Imóveis — Portofino Buritis

## Visão geral

Duas landing pages para a campanha Portofino Buritis, cada uma com formulário próprio que deve disparar **três coisas na mesma ação de envio**: evento GA4 (`generate_lead`), evento Meta Pixel (`Lead`) e `POST` para o painel de leads (`oliveira-leads-api`).

| | LP1 — "Pesquisa Estratégica" | LP2 — "Portofino Street Mall" |
|---|---|---|
| Domínio | lp.oliveiraimoveis.ia.br | wispy-field-ab1d.vanessabarbosadeoliveira9.workers.dev |
| Worker Cloudflare | `oliveira-pesquisa` | `wispy-field-ab1d` |
| Código-fonte local | `oliveira-lp-leads/public/index.html` (nesta pasta) | `oliveira-portofino-next/` (nesta pasta, Next.js) |
| pagina_origem no painel | `oliveiraimoveis.ia.br/pesquisa` | `Portofino Street Mall` |

Também existe `oliveira-portofino-cloudflare/` — protótipo estático antigo do LP2, **não é mais o que está publicado** (mantido só de referência histórica).

## 🚫 NÃO FAZER DEPLOY DA LP1 (instrução direta da Vanessa, 2026-07-03)

**A LP1 realmente publicada em `lp.oliveiraimoveis.ia.br` NÃO bate com o código-fonte local `oliveira-lp-leads`** — e essa diferença é **intencional**: a página ao vivo foi modificada (tem menu "ENTRAR"/login e abas "especialista"/"plataforma", parece ligada ao MVP da plataforma, pasta `01 - MVP Plataforma (Daniel)`) e **essa modificação deve ser respeitada**. O `oliveira-lp-leads` (formulário simples dourado/verde sem login) é uma versão **desatualizada/obsoleta** — não é para ser publicada por cima da atual.

**Regra: nunca fazer deploy da LP1 (worker `oliveira-pesquisa`) a partir de `oliveira-lp-leads` ou qualquer outra fonte local, mesmo que pareça um "fix" ou "atualização".** Se surgir pedido para editar/atualizar/mexer na LP1, checar com a Vanessa antes — não assumir que é seguro publicar.

## Diagnóstico de tracking (02/07/2026)

Comparando painel de leads × Meta Ads × GA4 nos mesmos 7 dias: painel registrou 50 leads reais, Meta atribuiu 12, GA4 registrou ~7 eventos-chave — apesar de 234 sessões de `meta/paid_social` no período. Achados:

1. **`generate_lead` está corretamente marcado como evento-chave no GA4** (Admin → Propriedade → Eventos → Eventos principais, stream "Site Oliveira Imóveis") — não é problema de configuração.
2. **Causa provável: perda de beacon por navegação prematura.** No `LeadFormModal.js` (LP2), a sequência do submit é: `gtag('event','generate_lead')` → `fbq('track','Lead')` → `fetch(leads-api, {keepalive:true})` → `window.open(wa.me/...)`. O `fetch` do painel usa `keepalive` e por isso sobrevive à troca de contexto; os beacons do `gtag`/`fbq` não têm essa proteção. Ao abrir o WhatsApp imediatamente (`window.open`), especialmente dentro do navegador in-app do Instagram/Facebook, a requisição de tracking pode ser cancelada antes de completar — isso explica por que o painel > Meta > GA4 em volume, nessa ordem.
3. **Fix recomendado (ainda não aplicado, pendente de aprovação):** atrasar `window.open()` ~250-300ms após disparar os eventos, ou trocar por `navigator.sendBeacon` para os beacons de tracking. Baixo risco, aplicável primeiro na LP2 (fonte conhecida e confiável).
4. **Meta Conversions API (médio prazo):** o worker `oliveira-leads-api` já recebe todo lead confirmado — dá para reenviar server-side pro Meta via Conversions API, eliminando a dependência do pixel do navegador.
5. **Campo "momento de expansão"** só existe no formulário local da LP1 (`oliveira-lp-leads`), não existe no LP2 (`LeadFormModal.js`). Se a LP1 ao vivo também não tiver esse campo, o relatório de qualidade de leads fica sem esse dado.

## Workers relacionados

- `oliveira-pesquisa` — serve a LP1 (fonte real desconhecida, ver pendência acima).
- `wispy-field-ab1d` — serve a LP2, a partir de `oliveira-portofino-next` (Next.js, export estático, `assets.directory: ./out`).
- `oliveira-leads-api` — recebe o `POST /lead` das duas LPs, grava em KV, notifica via ntfy.sh (topic `oliveira-imoveis-leads-2026`) e cria página no Notion (DB `c733bd65f54e4db0aad508e7fd3c9c76`) se `env.NOTION_TOKEN` estiver setado. Painel de leitura em `GET /leads?secret=oli2026admin` — **é uma tabela HTML simples, não expõe UTM/fbclid/momento** mesmo que o payload enviado tenha esses campos (eles ficam só no KV/Notion, não aparecem na tabela renderizada).

## GA4

- Property: `538068487` (measurement ID `G-4YM3X80NZ8`), conta Google `oliveiiraimoveis@gmail.com` / acessível também via `authuser=2` no Chrome de Vanessa.
- MCP dedicado em `../ga4-mcp/` (pasta irmã) — depende de `gcloud` autenticado localmente, **não funciona em runs automáticos/agendados**. Nesses casos, usar Claude in Chrome. Ver `../ga4-mcp/README.md`.
- Existe um relatório salvo no GA4 chamado "Lead Quality por Criativo | Portofino Loja 16" — conferir esse relatório pronto antes de reconstruir análises por criativo do zero.

## Meta Ads

- Ad Account: `775982088889277` (oliveira imoveis)
- Meta Pixel: `26815330474775862`
- 5 conjuntos ativos da campanha Portofino Buritis — ver `oliveira-imoveis-daily-report` (scheduled task) para a lista de `adset_id`.
