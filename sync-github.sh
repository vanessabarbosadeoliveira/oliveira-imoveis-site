#!/bin/bash
# sync-github.sh — sincroniza o repo oliveira-imoveis-site com o GitHub
# Roda automaticamente via launchd sempre que houver mudanças na pasta

REPO_DIR="/Users/vanessadeoliveira/Documents/Rede Oliveira Imóveis/02 - Site, Marketing e Identidade Visual/Site Oliveira Imóveis"
LOG="/Users/vanessadeoliveira/Documents/Rede Oliveira Imóveis/sync-github.log"

cd "$REPO_DIR" || exit 1

# Sincronizar skill mvp-oliveira (sempre copia a versão mais atual)
cp -r "/Users/vanessadeoliveira/.claude/skills/mvp-oliveira/." "$REPO_DIR/mvp-plataforma/"

# Verificar se há mudanças
if git diff --quiet && git diff --cached --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
  echo "$(date '+%Y-%m-%d %H:%M') — sem mudanças" >> "$LOG"
  exit 0
fi

# Commitar e fazer push
git add -A
TIMESTAMP=$(date '+%Y-%m-%d %H:%M')
git commit -m "sync automático — $TIMESTAMP

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"

if git push origin main; then
  echo "$TIMESTAMP — push OK" >> "$LOG"
else
  echo "$TIMESTAMP — ERRO no push" >> "$LOG"
fi
