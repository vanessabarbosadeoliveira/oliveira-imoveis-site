# lp-perf — velocidade das LPs

Pós-processamento das LPs (`lp-*`). Não toca em tracking (pixel, GA4, eventos, worker).

## Por que existe
As LPs de clínica, Getúlio Vargas e Instagram são geradas com imagens e fontes em base64 dentro do HTML (HTML de 0,5 a 1,2 MB). O navegador precisa baixar tudo antes de pintar e nada fica em cache. Em 4G lento isso levava o LCP a 8–10 s.

## Uso (depois de rodar o `build.py` da LP)
```bash
cd tools/lp-perf && npm install        # só na primeira vez
node externalizar-assets.mjs ../../lp-oportunidade-clinica/build/oportunidade-clinica-savassi.html
```
O script: grava imagens WebP e fontes WOFF2 em `build/<slug>/assets/` (nome com hash), troca as referências no HTML, adiciona `preload` do hero e das fontes, tira o fade-in do parágrafo do hero (elemento LCP) e cria `build/_headers` com cache de 1 ano. Se o HTML já está processado, não faz nada.

Para LPs que já servem arquivos (prop-360 e Iracema): `node webp-referencias.mjs <html> [--png-w=760]` converte JPG/PNG para WebP e atualiza as referências.

## Conferir antes de publicar
1. `npx wrangler dev --local` dentro da pasta da LP e abrir a página (desktop e celular).
2. Lighthouse mobile: `npx lighthouse <url> --form-factor=mobile --only-categories=performance`.
3. Deploy só com aval da Vanessa: `npx wrangler deploy --config wrangler.toml`.

Relatório completo: `docs/page-speed/2026-10-24-auditoria.md`.
