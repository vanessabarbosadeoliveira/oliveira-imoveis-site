# Link da bio do Instagram e atribuição do lead (14/10/2026)

## Links
| Uso | URL |
|---|---|
| **Bio (listagem de imóveis)** | `https://www.oliveiraimoveis.ia.br/imoveis?utm_source=instagram&utm_medium=organic_social&utm_campaign=bio&utm_content=perfil` |
| Link de Stories | `https://www.oliveiraimoveis.ia.br/imoveis?utm_source=instagram&utm_medium=organic_social&utm_campaign=bio&utm_content=story` |
| Um imóvel específico (ex.: 25) | `https://www.oliveiraimoveis.ia.br/imovel/25?utm_source=instagram&utm_medium=organic_social&utm_campaign=bio-imovel-25&utm_content=perfil` |
| Alternativa: LP certificada só com formulário | `https://www.oliveiraimoveis.ia.br/oportunidade-instagram-organico?utm_campaign=bio&utm_content=perfil` |

Padrão do projeto (ADR 0031): `utm_source=instagram`, `utm_medium=organic_social`, `utm_content` = lugar ou peça
(`perfil`, `story`, `reel-<peça>`). A classificação do lead (`classify_origin`) devolve `meta_organico` quando a
fonte é instagram/facebook e o meio contém "organic".

## O que o site já faz (verificado no bundle publicado em 14/10/2026)
`captureAttribution()` guarda `utm_*`, `adset_id`, `ad_id`, `placement`, `fbclid` e `gclid` em
`sessionStorage["oli_attr"]` na primeira página da sessão (só preenche o que ainda está vazio) e
`event_source_url` com a URL de entrada. `registerLead()` envia isso em `POST /api/leads`. Por isso o UTM
sobrevive à navegação entre `/imoveis` e `/imovel/N` dentro da mesma sessão.

## O que falta (ajuste para o site de imóveis)
O lead leva `ga_client_id`, mas **não leva o id da sessão do GA4**. Sem ele, o evento server-side cai em
`(not set)` mesmo com UTM correto. No `readAttribution()` do site (mesmo arquivo de `captureAttribution`):

```js
// id da sessão GA4: cookie _ga_<ID> = GS1.1.<sessao>.… (antigo) ou GS2.1.s<sessao>$o… (novo)
const gs = document.cookie.split(';').map((s) => s.trim()).find((s) => s.startsWith('_ga_'));
const v = gs ? gs.split('=')[1] : '';
const m = v.match(/^GS1\.\d\.(\d+)/) || v.match(/^GS2\.\d\.s(\d+)/);
if (m) e.ga_session_id = m[1];
```

e a rota `/api/leads` precisa repassar `ga_session_id` ao worker `oliveira-leads-api` (o worker já aceita o campo
na branch `claude/ga4-session-id`, commit `1bc8543`; sem deploy).

## Como testar
1. Abrir o link da bio no celular, dentro do Instagram.
2. Navegar para um imóvel, abrir o formulário e enviar 1 lead marcado como teste.
3. Painel de leads: `utm_source=instagram`, `utm_medium=organic_social`, `utm_content=perfil`.
4. GA4 em tempo real: origem `instagram / organic_social` (e o `generate_lead` na mesma sessão, depois do patch).
