# Pedido ao Daniel — velocidade do site www.oliveiraimoveis.ia.br

Texto para a Vanessa enviar. Medido em 24/10/2026 (Lighthouse 13, mobile, 4G lento simulado, mediana de 3 execuções; cabeçalhos por curl). Nada do site foi alterado.

---

Daniel, medi o site e o plano da Cloudflare (Free no domínio, Workers Paid na conta) não é o gargalo. O que pesa está no app Next.js/OpenNext. Em ordem de impacto:

**1. Cache longo nos arquivos estáticos (30 min de trabalho, ganho em todas as visitas de retorno)**
`/_next/static/*` (JS, CSS, fontes) está saindo com `cache-control: public, max-age=0, must-revalidate`, e `/_next/image` sai sem `cache-control`. O Lighthouse aponta 469 KiB (home) a 638 KiB (imóvel) sem cache eficiente. Sugestão: criar `public/_headers` no projeto:
```
/_next/static/*
  Cache-Control: public, max-age=31536000, immutable
/_next/image*
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800
/assets/*
  Cache-Control: public, max-age=604800
```
Ganho: visita de retorno sem revalidar ~50 arquivos; nada muda na primeira visita.

**2. TTFB irregular do HTML (maior impacto no LCP da página de imóvel)**
Em 4 chamadas seguidas à home o TTFB foi 1,48 s, 0,13 s, 0,11 s e 1,10 s; em `/imovel/16`, 1,35 s, 0,26 s e 0,57 s. No Lighthouse a página de imóvel gastou 1,8 a 2,4 s só esperando o HTML (`x-nextjs-cache: STALE`) e teve LCP de 8,3 s. O HTML sai com `s-maxage=2` (imóvel) e `s-maxage=224` (home), sem `cf-cache-status`, ou seja, o HTML não fica no cache de borda e cada renovação passa pelo Worker. Sugestões, da mais simples para a mais ampla:
- Subir o `revalidate` das páginas de imóvel e da home (por exemplo 300 s a 3600 s) e usar `generateStaticParams` nos imóveis, para quase toda visita receber HTML já pronto.
- Ativar o cache regional do cache incremental do OpenNext (`withRegionalCache` sobre R2/KV no `open-next.config.ts`), conferindo na documentação da versão que vocês usam.
- Se ainda sobrar variação: guardar o HTML na Cache API do Worker (`caches.default`) com TTL curto e `stale-while-revalidate`.
Ganho esperado: TTFB estável abaixo de 0,3 s; o LCP do imóvel cai de ~8 s para a faixa de 3 a 4 s apenas com isso (estimativa do Lighthouse: 1,7 s de economia na latência do documento).

**3. Imagem principal da home difícil de descobrir (LCP 3,6 s)**
O LCP da home é o banner com `background-image: url(/assets/home/hero-apartamento.jpg)` no CSS. O navegador só descobre depois de baixar e processar o CSS, e não há `fetchpriority`. Sugestão: trocar por `<Image priority fill sizes="100vw">` (ou `<link rel="preload" as="image" fetchpriority="high">`). As outras três imagens de fundo (`skyscrapers.jpg` 153 KB, `shop.jpg` 74 KB, `belo-horizonte.jpg` 75 KB) estão em JPEG; passar para WebP/AVIF e carregar só quando aparecem.

**4. CSS bloqueando a renderização**
3 a 4 arquivos CSS (≈ 49 KB) bloqueiam o primeiro desenho. O Lighthouse estima 620 ms (home) e 750 ms (imóvel) de economia. Sugestão: `experimental.inlineCss: true` no `next.config` ou reduzir CSS não usado (26 a 40 KiB).

**5. HTML de 240 KB e imagens com tamanhos excessivos**
A home tem 22 `srcSet`, cerca de 22 KB só de atributos, com larguras de 256 a 3840 px (o `src` padrão pede `w=3840`). As logos são pedidas com `w=1920` para um desenho de 616 px, e há 4 `preload` de logo (claro, escuro e simples) disputando banda com o banner. Sugestão: limitar `images.deviceSizes` e `images.imageSizes` (por exemplo 360, 640, 828, 1080, 1280), usar `sizes` corretos nas logos e preload só da logo visível.

**6. JavaScript**
O Lighthouse aponta 184 a 243 KiB de JS não usado e 36 KiB de JS legado. Sugestão: ajustar `browserslist` para navegadores atuais e carregar fora do caminho crítico os componentes que só aparecem depois do clique (galeria/carrossel, mapa).

**7. Pequenos ajustes**
- `oliveiraimoveis.ia.br` redireciona 301 para `www` (≈ 0,4 s a mais para quem entra sem o `www`). Manter, mas garantir que links e anúncios apontem direto para `www`.
- A home está com `<meta name="robots" content="noindex">`. Se não for intencional nesta fase, precisa sair antes de depender de busca orgânica.
- HTTP/3 e compressão Brotli já estão ativos; não há nada a fazer.

**Tracking (só para decisão conjunta, não mexer sem a Vanessa):** GA4 + Pixel Meta somam ≈ 450 KB (gtag 177 KB, fbevents 112 KB, config do pixel 157 KB), com pouco custo de CPU (≈ 70 ms). Se quiserem carregá-los depois do `load`, medir antes para não perder PageView de quem sai rápido.

**Ganho esperado somando 1 a 5:** home de LCP 3,6 s para cerca de 2,0 a 2,5 s; página de imóvel de 8,3 s para cerca de 3 s; visitas de retorno quase sem download de JS/CSS. São estimativas a partir do Lighthouse; vale medir de novo depois de cada mudança.
