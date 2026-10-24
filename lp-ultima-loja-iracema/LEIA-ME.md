# LP Última Loja — Centro Comercial Iracema

- **URL:** https://www.oliveiraimoveis.ia.br/ultima-loja-iracema
- **Worker Cloudflare:** `oliveira-lp-iracema` (conta 669491c12f3d53a3f28ba3270668efaf)
- **Rota:** `www.oliveiraimoveis.ia.br/ultima-loja-iracema*` (não toca no worker do site, `soft-smoke-c987`)
- **Fonte:** `build/ultima-loja-iracema.html` + imagens em `build/ultima-loja-iracema/img/`
- **Leads:** formulário POSTa JSON para FormSubmit (contato@oliveiraimoveis.ia.br) e depois abre WhatsApp (31 99955-8360)
- **Tracking (ativo desde 2026-07-20):** GA4 `G-4YM3X80NZ8` (evento `generate_lead` no envio) + Meta Pixel `26815330474775862` (`PageView` + `Lead`). UTMs/fbclid da URL são capturados e enviados junto com o lead no e-mail.

## Para atualizar
```bash
cd "lp-ultima-loja-iracema"
npx wrangler deploy --config wrangler.toml
```
(usa o login OAuth do wrangler já salvo no computador)

## Velocidade
Imagens em WebP (`public/loja-iracema/*.webp`, os JPG/PNG originais continuam no disco), fontes do Google carregadas sem bloquear a renderização e `build/_headers` com cache de 7 dias. Para novas imagens: `node tools/lp-perf/webp-referencias.mjs lp-ultima-loja-iracema/build/ultima-loja-iracema.html`.
