# LP Proprietários 360 (captação de proprietários de imóvel comercial em BH)

- Arquivo publicado: `build/oportunidade-proprietarios-360.html` → rota `www.oliveiraimoveis.ia.br/oportunidade-proprietarios-360`.
- Imagens em `build/oportunidade-proprietarios-360/assets/`, referenciadas por caminho absoluto (`/oportunidade-proprietarios-360/assets/...`), porque a página é servida sem barra final.
- Worker PRÓPRIO (`oliveira-lp-proprietarios-360`, `wrangler.toml` desta pasta). Não toca no worker do site institucional nem em `/imovel/*` (site do Daniel).
- Todo visitante é proprietário: `publico_alvo = proprietario`, `segmento = proprietarios-360`, `pagina_origem = oportunidade-proprietarios-360 (www.oliveiraimoveis.ia.br)`.
- Tracking igual ao do site: pixel `26815330474775862` (código base na página), `gtag` `G-4YM3X80NZ8`, sem GTM. `Lead` (eventID X) + `LeadProprietario` (eventID X-publico), o mesmo par que o worker `oliveira-leads-api` espelha pela API de Conversões.
- Campos extras do formulário (`tipo_imovel`, `vinculo`, `local_imovel`, `situacao_imovel`) seguem ao n8n pelo worker (PR do `forwardToN8n`).
- `?v=1|2|3` só troca foto e chamada; WhatsApp direto sai com `Ref.: LP-PROP-V1|V2|V3`. A atribuição do anúncio vem das `url_tags` (macros), não do `?v=`.
- `criativos/`: criativo 02 (placa de aluga-se) sem o reflexo; não é servido (fora de `build/`).
- Deploy (somente com aval da Vanessa): `npx wrangler deploy --config wrangler.toml` nesta pasta.
- Depois de publicar: Gerenciador de Eventos (`Lead` e `LeadProprietario`, Navegador + Servidor desduplicados); `sync_leads` e `paid_without_ad` = 0 nos leads novos.

## Velocidade
Imagens em WebP (`assets/*.webp`). A foto da primeira tela (`?v=1|2|3`) é escolhida por um script no `<head>` que faz o preload só da foto do anúncio; os `<img>` do hero não têm `src` no HTML (o script do fim da página define). Fonte Montserrat carregada sem bloquear, com fallback de métrica para não gerar CLS. `build/_headers` com cache de 7 dias.
