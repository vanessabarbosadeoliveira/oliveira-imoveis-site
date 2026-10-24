# Auditoria de velocidade — site e LPs (24/10/2026)

## Resumo
- O plano da Cloudflare não é o gargalo. As LPs (`/oportunidade-*`, `/ultima-loja-iracema`) já saem do cache de borda (`cf-cache-status: HIT`, TTFB 0,08–0,16 s, Brotli e HTTP/3 ativos). O problema delas era o peso: as páginas de clínica, Getúlio Vargas e Instagram tinham de 0,5 a 1,2 MB de HTML, porque imagens e fontes estavam embutidas em base64.
- Corrigido nas LPs (PR, não mergeado): nota mobile de 60–91 para 96–99 e LCP de 3–10,5 s para 2,0–2,7 s.
- O site principal (www, do Daniel) tem outro problema: HTML sem cache de borda e TTFB irregular, mais arquivos estáticos sem cache longo. Nada foi alterado; o pedido está em `pedido-daniel.md`.
- Tracking (GA4, Pixel, worker) não foi alterado. Ver "Propostas que dependem de decisão".

## Como foi medido
- Lighthouse 13.5 local, mobile, 4G lento simulado (padrão do PageSpeed Insights), mediana de 3 execuções por página. A API pública do PageSpeed Insights devolveu 429 (cota diária sem chave).
- **Antes:** produção (www e lp.), em 24/10/2026.
- **Depois:** versão do PR servida por `wrangler dev --local` (mesmo motor de assets do Cloudflare, com `_headers`). Controle: a versão antiga servida do mesmo jeito deu resultados iguais aos de produção (Clínica Savassi 72 vs 71, Farmácia 67 vs 68, Iracema 67 vs 68, Proprietários 360 69 vs 64), então a comparação é justa. A nota real depois do deploy deve ficar perto, mas precisa ser conferida em produção.
- Lighthouse é laboratório. Os números de campo (CrUX) só aparecem com tráfego suficiente.

## Antes e depois — LPs (mobile)
| Página | Nota | LCP | FCP | Peso total (KB) | HTML comprimido (KB) |
|---|---|---|---|---|---|
| Clínica (principal) | 60 → 99 | 10,5 s → 2,3 s | 5,7 → 0,9 s | 1286 → 684 | 825 → 22 |
| Clínica Savassi | 71 → 99 | 8,4 s → 2,1 s | 2,8 → 0,9 s | 833 → 676 | 373 → 21 |
| Farmácia | 68 → 99 | 9,0 s → 2,1 s | 3,4 → 0,9 s | 960 → 691 | 500 → 21 |
| Quiropraxia | 68 → 99 | 8,9 s → 2,1 s | 3,3 → 0,9 s | 956 → 689 | 495 → 21 |
| Tricologia | 68 → 99 | 9,0 s → 2,0 s | 3,3 → 0,9 s | 945 → 681 | 484 → 21 |
| Recovery | 85 → 99 | 3,4 s → 2,1 s | 3,4 → 0,9 s | 957 → 688 | 495 → 21 |
| Palmira 655 | 91 → 99 | 2,9 s → 2,1 s | 2,7 → 0,9 s | 829 → 672 | 368 → 21 |
| Instagram orgânico | 85 → 98 | 3,4 s → 2,4 s | 3,2 → 0,9 s | 916 → 682 | 455 → 21 |
| Proprietários 360 | 64 → 98 | 9,2 s → 2,3 s | 4,0 → 0,6 s | 975 → 728 | 12 → 11 |
| Última loja Iracema | 68 → 96 | 8,7 s → 2,7 s | 3,4 → 0,8 s | 1875 → 964 | 21 → 19 |

CLS ficou em 0 (Iracema 0,013). TBT entre 12 e 68 ms. O peso que sobra é quase todo de tracking (ver abaixo).

Não medidas em produção: `oportunidade-clinica-buritis`, `-serra` e `oportunidade-palmira-655-v2` (mesmo tratamento, mesmo template).

## Antes — site principal e lp.
| Página | Nota | LCP | FCP | TBT | CLS | TTFB (doc.) | Peso |
|---|---|---|---|---|---|---|---|
| www home | 87 | 3,7 s | 1,6 s | 45 ms | 0,000 | 750 ms | 1395 KB |
| www imóvel (`/imovel/16`) | 72 | 8,3 s | 1,9 s | 54 ms | 0,000 | 1060 ms | 1280 KB |
| lp.oliveiraimoveis.ia.br | 87 | 3,9 s | 1,9 s | 91 ms | 0,001 | 661 ms | 854 KB |

Sem "depois": são do Daniel (www) e o código ao vivo de `lp.` diverge do repositório (ver `_legacy-lp1-lp2-source/README.md`: nunca fazer deploy por cima). Diagnóstico de `lp.` (Next.js/OpenNext): TTFB de 0,7 a 1,5 s (`x-nextjs-cache: MISS`), 694 KB de JS (≈ 450 KB de tracking), 3 fontes (≈ 124 KB), 248 KiB de JS não usado, estáticos sem cache longo. As correções são as mesmas dos itens 1, 2 e 6 do pedido ao Daniel.

## O que pesava (LPs) e o que foi feito
| # | Problema | Impacto | Correção no PR |
|---|---|---|---|
| 1 | Imagens em base64 no HTML (hero, antes/depois, logos; a mesma foto duplicada no hero e no "depois") | HTML de 0,5–1,2 MB bloqueava o primeiro desenho; nada em cache | Imagens viram arquivos WebP com hash no nome; foto repetida vira um arquivo só; JPG/PNG pesados convertidos (ex.: "antes" PNG 468 KB → 40–60 KB; logo Eletro Ferragens 636 KB → 75 KB) |
| 2 | Fontes WOFF2 em base64 (≈ 58 KB no HTML) | Inflava o HTML | Arquivos `.woff2` com `preload` das 3 usadas na primeira tela |
| 3 | Hero sem `preload` | Descoberta tardia da imagem | `<link rel="preload" as="image" fetchpriority="high">` do hero (já havia `fetchpriority` no `<img>`) |
| 4 | Parágrafo do hero (elemento LCP) nascia com opacity 0 e fade de 1,1 s | LCP só era contado após ~1,4 s, e o Lighthouse colocava GA4/Pixel no caminho do LCP: nota 76 mesmo com HTML leve | `.hero .hero__text{animation:none}`: o texto aparece de imediato; título, logo e formulário mantêm o fade. LCP 7,0 s → 2,1 s |
| 5 | Prop-360: foto da primeira tela trocada por JS depois do carregamento (`?v=2/3` baixava a foto padrão e depois a certa) e Montserrat bloqueando | Download desperdiçado e LCP tardio | Script no `<head>` faz `preload` só da foto do anúncio; `<img>` sem `src` no HTML (o script existente do fim da página define; há `<noscript>`); Montserrat sem bloquear, com fonte de reserva de mesma métrica (CLS 0,07 → 0) |
| 6 | Iracema: PNG/JPG de até 636 KB, botão de WhatsApp PNG 159 KB, Google Fonts bloqueando | 1,9 MB de imagens | Tudo em WebP (2,7 MB → 0,8 MB nas imagens referenciadas); Google Fonts com `preload` + `onload` e `<noscript>` |
| 7 | Estáticos sem cache longo | Visita de retorno rebaixava tudo | `build/_headers`: `immutable, 1 ano` nos arquivos com hash; 7 dias onde o nome não tem hash (prop-360, Iracema) |
| 8 | `width`/`height` ausentes em várias imagens | Risco de CLS | Dimensões adicionadas (prop-360 e imagens extraídas) |

Já estavam corretos: `loading="lazy"` nas imagens abaixo da dobra, `fetchpriority="high"` no hero, `font-display: swap`, GA4 com `async`.

## Terceiros (as LPs depois da correção)
| Terceiro | Transferência | Tempo de CPU |
|---|---|---|
| Meta (fbevents 112 KB + config do pixel 157 KB) | 276 KB | ≈ 41–45 ms |
| Google (gtag 177 KB) | 182 KB | ≈ 26 ms |
| Cloudflare Web Analytics (beacon) | 10 KB | ≈ 1–2 ms |

São ≈ 450 KB, cerca de 65% do peso restante da LP, mas todos assíncronos e com pouco custo de CPU (TBT < 70 ms). Teste de limite: com esses dois domínios bloqueados, a Clínica Savassi vai a LCP 2,4 s, nota 98 e 228 KB, sem ganho adicional sobre o resultado já obtido (2,1 s, nota 99), porque o fade do hero era o que atrasava o LCP. Adiar GA4/Pixel até o `load` (variante testada em rascunho) também não mudou a nota. Conclusão: hoje o tracking não limita mais o LCP.

## Cache de borda, cabeçalhos e protocolo
| Item | LPs | www | lp. |
|---|---|---|---|
| Cache de borda do HTML | HIT (assets do Workers) | não (`s-maxage=2` imóvel, `224` home, sem `cf-cache-status`) | não (`s-maxage=31536000`, `x-nextjs-cache: MISS`) |
| Compressão | Brotli | Brotli | Brotli |
| HTTP/3 | `alt-svc: h3` | idem | idem |
| Early Hints | não observado (103) | não observado | não observado |
| Cache dos estáticos | `max-age=0, must-revalidate` (corrigido no PR) | `/_next/static/*` e `/assets/*`: `max-age=0, must-revalidate`; `/_next/image`: sem `cache-control` | idem |
| Redirecionamento | — | `oliveiraimoveis.ia.br` → 301 → `www` (+ ≈ 0,4 s) | — |

Early Hints exige `Link` na resposta e o recurso ligado; em HTML gerado por Worker o ganho é limitado, então não foi tratado.

## Propostas que dependem de decisão (não aplicadas)
1. **Tracking:** nenhuma mudança. Se quiserem reduzir ainda mais, a opção seria carregar GA4/Pixel depois de interação ou de alguns segundos. Custo: risco de perder PageView de quem sai rápido e de desalinhar a deduplicação com a API de Conversões. Pelos testes acima o ganho já não compensa; sugiro não fazer.
2. **Iracema — hospedar Google Fonts no próprio domínio** (Playfair 4 estilos, Poppins 5 pesos): elimina duas conexões externas. Exige baixar os arquivos de fonte; precisa de aval. Hoje já não bloqueia a renderização.
3. **AVIF:** ~20% menor que WebP, mas o custo de decodificação em celulares simples e o ganho de poucos KB não justificam agora.
4. **Hero em versão recortada para celular:** no celular o hero fica com ≈ 1170 px de altura e mostra só uma faixa estreita da foto horizontal; uma versão recortada de ~60 KB seria possível, mas depende do enquadramento definido pela Vanessa.
5. **Cache de HTML nas LPs:** hoje `max-age=0, must-revalidate` com ETag (revalida a cada visita, 304 rápido). Não mexi para não atrasar atualizações de preço/texto.
6. **Apagar originais** (JPG/PNG/`img/` duplicado em `lp-ultima-loja-iracema`) que já não são usados: reduz o deploy, sem efeito na velocidade.

## Antes de publicar (deploy depende de aval)
1. Na pasta de cada LP: `npx wrangler dev --local` e conferir desktop e celular (a Savassi e a Prop-360 já foram conferidas, com `?v=2` testado).
2. `npx wrangler deploy --config wrangler.toml` (um por pasta: clínica, getúlio-vargas, instagram, proprietários 360, iracema).
3. Depois do deploy: Gerenciador de Eventos do Meta (`PageView`, `Lead`, `LeadProprietario`) e GA4 em tempo real; a mudança não toca nesses scripts, mas vale a conferência.
4. Rodar de novo o Lighthouse nas URLs de produção e comparar com a tabela.

## Reprodução
`tools/lp-perf/LEIA-ME.md`. Os `build.py` das LPs continuam gerando base64: sempre rodar `externalizar-assets.mjs` depois deles.
