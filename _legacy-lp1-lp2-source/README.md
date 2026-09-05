# Código-fonte legado — LP1 e LP2

Recuperado em 2026-09-05 de uma cópia órfã em `Rede Oliveira Imóveis/02 - Site, Marketing e Identidade Visual/skills/lp1-lp2-oliveira/`, onde estava desde antes de 2026-06-26 sem estar em nenhum git. A skill `site-oliveira` (global) chegou a documentar esse código como "não localizado em nenhum repositório atual" (27/08/2026) — essa nota está desatualizada, o código está aqui agora.

**LP1 e LP2 estão desativadas e não são mais referência de design/copy** (ver `~/.claude/skills/site-oliveira/references/lp1-lp2-landing-pages.md`). A referência atual para novas LPs é a LP "Savassi antes/depois" (`lp-oportunidade-clinica/build/oportunidade-clinica-savassi.html`).

- `oliveira-lp-leads/` — código-fonte da LP1 (`lp.oliveiraimoveis.ia.br`, worker `oliveira-pesquisa`). ⚠️ **A versão publicada ao vivo foi modificada e diverge deste código** (ganhou login/abas ligadas ao MVP da plataforma) — essa divergência é intencional, **nunca fazer deploy deste código por cima da versão ao vivo**.
- `oliveira-portofino-next/` — código-fonte da LP2 (Next.js, worker `wispy-field-ab1d`), sem `node_modules`/`.next` (rodar `npm install` antes de buildar). Inclui `out/` (export estático já gerado) e um zip do export estático.
- `oliveira-portofino-cloudflare/` — protótipo estático mais antigo da LP2, anterior à versão Next.js. Só para referência histórica.
- `oliveira-leads-worker/` — versão antiga do worker de leads (com backup `worker.js.bak-20260812`). A fonte de verdade atual do worker de leads é `oliveira-leads-api/worker.js` (na raiz deste repo, atualizado 27/08/2026) — não confundir os dois.
