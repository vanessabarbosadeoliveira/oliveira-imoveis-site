# LP Instagram orgânico (link da bio / Linktree)

- Fonte editável: gerada por `assets-src/build_instagram.py` a partir da LP Palmira 655 v2 (mesmo formulário "Quem é você?", mesmo rastreio), com os textos do site oliveiraimoveis.ia.br. **Só o formulário**: sem provas sociais, case, depoimentos ou seções abaixo do topo (pedido da Vanessa, 07/10/2026).
- Arquivo publicado: `build/instagram.html` → rota `www.oliveiraimoveis.ia.br/instagram`.
- **Origem certificada:** a LP força `utm_source=instagram`, `utm_medium=organico`, `placement=link-da-bio` e zera o `fbclid`, independentemente da URL. `utm_campaign` e `utm_content` (via `?utm_campaign=` / `?utm_content=`) só nomeiam a ação; sem eles ficam `instagram-organico` / `link-da-bio`.
- Sem imóvel nosso: `imovel_id` vazio (nenhum imóvel entra no negócio da Loft).
- Eventos Meta: `SubmitApplication` + `LeadEmpresario`/`LeadProprietario`, `SaiuSemPreencher`, `ViewContent`, `CTAClick`.
- ⚠️ Worker `oliveira-lp-instagram` é separado do site institucional (`soft-smoke`). Não editar nem publicar nada no worker do site.
- Deploy (somente com aval): `npx wrangler deploy --config wrangler.toml` nesta pasta.

Link para o Linktree:
`https://www.oliveiraimoveis.ia.br/instagram?utm_campaign=bio-linktree&utm_content=linktree`
