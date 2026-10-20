# oliveira-edge-tracking-imovel — PageView (Meta) + GA4 nas páginas /imovel/* (remendo temporário)

**Por quê:** o site do Daniel (Next.js, worker `soft-smoke-c987`) não carrega o Pixel nem o GA4 na abertura das páginas
`/imovel/*`; o Pixel só é carregado depois do envio do formulário. A campanha paga do imóvel 23 (20/10/2026) mandava
cliques para uma página que a Meta e o GA4 não enxergavam. Pedido definitivo ao Daniel: `docs/handoff-site-pageview-ga4-imovel.md`
do repo `mcp-metaads-oliveira`.

**O que faz:** Worker na rota `www.oliveiraimoveis.ia.br/imovel/*`. Chama o site do Daniel por service binding, e só nas respostas
HTML 200 de GET/HEAD acrescenta, no fim do `<head>`, um script que inicia o GA4 (`G-4YM3X80NZ8`) e o Pixel (`26815330474775862`)
com `PageView`. Nada mais muda (testado byte a byte). Não dispara `Lead` nem `generate_lead`.

**Segurança:** POST, `_rsc`, APIs, redirects e erros passam intactos; resposta comprimida não é reescrita; qualquer exceção cai no
`passThroughOnException`. Kill switch: variável `TRACKING_ENABLED = "0"` (painel Cloudflare > Workers > este worker > Settings > Variables).

## Publicar
```bash
cd edge-tracking-imovel
npx wrangler@4 deploy
```
Conferir logo depois: `curl -s https://www.oliveiraimoveis.ia.br/imovel/23 | grep -c data-oi-edge-tracking` (esperado 1) e o cabeçalho
`x-oi-edge-tracking: 1`.

## Desfazer (menos de 1 minuto)
```bash
npx wrangler@4 delete --name oliveira-edge-tracking-imovel
```
(remove o worker e a rota; o site volta a ser servido só pelo `soft-smoke-c987`).

## IMPORTANTE: remover quando o Daniel publicar o Pixel/GA4 no código do site
Os dois ao mesmo tempo contam `PageView` em dobro. Ao receber o ok do Daniel, rodar o comando de desfazer acima no mesmo dia.

## Teste local
```bash
npx wrangler@4 dev --local --port 8799 --var UPSTREAM_ORIGIN:https://www.oliveiraimoveis.ia.br
```
(`UPSTREAM_ORIGIN` só existe para teste; em produção vale o binding `SITE`.)
