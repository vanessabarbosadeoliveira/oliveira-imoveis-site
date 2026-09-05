# Setup — Meta Organic MCP

## O que precisa
Um **Page Access Token** com escopos:
- `instagram_basic`
- `instagram_manage_insights`
- `pages_read_engagement`
- `pages_show_list`

## Como pegar o token (5 minutos)

### 1. Acesse o Graph API Explorer
https://developers.facebook.com/tools/explorer/

### 2. Selecione o App
- Canto superior direito → selecione o app da Oliveira Imóveis (ou "Meta App Ads" se usar o mesmo da conta de anúncios)
- Se não existir app: crie em https://developers.facebook.com → "Criar App" → "Business"

### 3. Gere o token
- Clique em "Gerar token de acesso"
- Marque as permissões:
  - `instagram_basic`
  - `instagram_manage_insights`
  - `pages_read_engagement`
  - `pages_show_list`
- Autorize a conta

### 4. Troque por token de longa duração (~60 dias)
Abra o terminal e rode (substituindo valores):

```bash
curl "https://graph.facebook.com/v19.0/oauth/access_token?\
grant_type=fb_exchange_token&\
client_id=SEU_APP_ID&\
client_secret=SEU_APP_SECRET&\
fb_exchange_token=TOKEN_CURTO_DO_EXPLORER"
```

Retorna um token com validade de ~60 dias.

### 5. Configure o MCP

```bash
# Edite ~/.claude.json e adicione META_PAGE_ACCESS_TOKEN em env:
python3 -c "
import json
with open('/Users/vanessadeoliveira/.claude.json') as f:
    c = json.load(f)
c['mcpServers']['oliveira-meta-organic']['env']['META_PAGE_ACCESS_TOKEN'] = 'SEU_TOKEN_AQUI'
with open('/Users/vanessadeoliveira/.claude.json', 'w') as f:
    json.dump(c, f, indent=2, ensure_ascii=False)
print('OK')
"
```

### 6. Verifique

```bash
META_PAGE_ACCESS_TOKEN=seu_token node /Users/vanessadeoliveira/.claude/skills/caso-credaluga-palmira/meta-organic-mcp/src/server.js --check
```

Deve mostrar:
```
oliveira-meta-organic-mcp OK
PAGE_ID=675648152299381
IG_ACCOUNT_ID=XXXXXXXXXX
```

## Renovação do token
Token de longa duração dura ~60 dias. Para renovar automaticamente (futuro):
- Use um System User token no Business Manager → nunca expira
- Ou crie um cron que renova o token antes de expirar
