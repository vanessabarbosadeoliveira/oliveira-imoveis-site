# Deploy — oliveira-ga4-api

Worker que expõe o GA4 via API (conta de serviço), pra substituir a leitura por Claude in Chrome
na rotina diária de métricas da Oliveira Imóveis. Só você deve rodar esses comandos — Claude não
deve tocar em segredos.

## 1. Dar acesso ao GA4 pra conta de serviço

No arquivo `.json` que você baixou, o e-mail da conta de serviço é
`oliveira-ga4-mcp@oliveira-imoveis-ga4-mcp.iam.gserviceaccount.com`.

1. Acesse o GA4 → Administrador → **Acesso à propriedade** (propriedade 538068487).
2. Adicionar usuário → cole esse e-mail → papel **Leitor (Viewer)** → Adicionar.

Sem esse passo, a chave é válida mas não enxerga nenhum dado.

## 2. Criar o projeto do worker

```bash
mkdir -p oliveira-ga4-api && cd oliveira-ga4-api
# copiar worker.js e wrangler.jsonc (anexados) pra essa pasta
npm init -y
npm install --save-dev wrangler
```

## 3. Configurar os segredos (rode você mesma, um de cada vez — cada comando vai pedir o valor)

```bash
npx wrangler secret put GA4_SA_EMAIL
# cole: oliveira-ga4-mcp@oliveira-imoveis-ga4-mcp.iam.gserviceaccount.com

npx wrangler secret put GA4_SA_PRIVATE_KEY
# cole o valor do campo "private_key" do arquivo .json (com as \n literais, como está no arquivo)

npx wrangler secret put API_SECRET
# escolha uma senha sua pra proteger o endpoint (ex.: algo parecido com o "oli2026admin" do painel de leads)
```

## 4. Deploy

```bash
npx wrangler deploy --config wrangler.jsonc
```

Isso devolve uma URL tipo `https://oliveira-ga4-api.<sua-conta>.workers.dev`.

## 5. Testar

```bash
curl "https://oliveira-ga4-api.<sua-conta>.workers.dev/report?secret=<seu API_SECRET>&desde=2026-08-11&ate=2026-08-11"
```

Deve devolver um JSON com `resumo` (usuários, sessões, eventos principais) e `aquisicao`
(tabela por origem/mídia). Se dado `unauthorized`, revise o passo 1 (acesso à propriedade) e
confirme que os segredos foram salvos (`npx wrangler secret list`, mostra só os nomes, não os valores).

## 6. Depois de confirmar que funciona

Me avisa a URL do worker (a URL em si não é segredo, só o `API_SECRET` é) que eu atualizo a skill
`marketing-oliveira` pra usar esse endpoint em vez do Claude in Chrome na coleta de GA4.

## Importante — sobre o arquivo .json original

Depois de configurar os segredos, apague o arquivo `.json` da chave da pasta de Downloads (ou
mova pra um cofre de senhas) — ele já cumpriu a função de gerar os segredos no Cloudflare e não
precisa mais ficar solto num arquivo. Se esse arquivo foi enviado por algum canal que não é
totalmente privado, considere revogar essa chave no Google Cloud Console (IAM → Contas de
serviço → Chaves) e gerar uma nova.
