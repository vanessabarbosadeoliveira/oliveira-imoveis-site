# ARQUIVADO — não é fonte de deploy

Este `worker.js` foi, por um bom tempo, mais completo/atualizado do que o
código versionado em `oliveira-imoveis-site/oliveira-leads-api/worker.js`
(tinha GA4 Measurement Protocol, Meta Conversions API, filtros e
`format=json`/`csv` no `GET /leads` que o outro arquivo não tinha).

Em 25/09/2026 um deploy feito a partir de `oliveira-leads-api/worker.js`
sobrescreveu o Worker em produção com a versão desatualizada, derrubando
GA4/Meta CAPI server-side e o `sync_leads` do `mcp-metaads-oliveira` (que
depende de `&format=json`). Corrigido em 26/09/2026 mesclando as duas
versões de volta em `oliveira-imoveis-site/oliveira-leads-api/worker.js`.

**A partir de agora, a única fonte de verdade do Worker `oliveira-leads-api`
é `oliveira-imoveis-site/oliveira-leads-api/worker.js`.** Esta pasta fica só
como histórico/referência — nunca rodar `wrangler deploy` a partir daqui.
