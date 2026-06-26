# Padrão V5 — Pesquisa de Mercado Oliveira Imóveis

**Versão:** v5 · maio/2026
**Caso fundador:** Buritis · Lojas 15 e 16 Portofino Street Mall
**Status:** padrão default para toda nova pesquisa de mercado da Oliveira em qualquer bairro/cidade

---

## O que tem nesta pasta

| Arquivo | Para que serve |
|---|---|
| `README.md` | Este documento — visão geral do padrão |
| `SKILL_V5.md` | A skill `analise-mercado-oliveira` na versão atualizada (substituir a antiga quando quiser) |
| `template_html.html` | HTML editorial completo — copiar, trocar dados do bairro, entregar |
| `template_pptx.js` | Script Node.js que gera o PPTX de 18 slides — `npm install pptxgenjs` + `node template_pptx.js` |
| `checklist_pesquisa.md` | Passo-a-passo da pesquisa para cada novo bairro |

---

## O que mudou da v3 para a v5

| Dimensão | v3 (Buritis maio/2025) | v5 (Buritis maio/2026) |
|---|---|---|
| **Tese** | "Aqui estão os gaps de mercado · abra X" | "Polo maduro · suba para upgrade premium" |
| **Verificação** | Doctoralia + Buritis Juntos + pesquisa de campo única | Google Maps direto + 2ª fonte para CADA categoria · validação in loco do cliente |
| **Modalidades** | 9 oportunidades em ranking | 40 modalidades mapeadas com quantidades reais |
| **Fontes** | 15-20 fontes | 22 fontes com link clicável (regra: zero afirmação sem fonte) |
| **Entrega** | HTML | HTML + PPTX 18 slides |
| **Risco** | Cliente abre Google Maps, vê 6 fisios "no zero" que afirmei, perde credibilidade | Cada número auditável; cliente pode conferir |

---

## Regra de Ouro V5 (não negociável)

> **Nunca afirmar "zero" ou contagem baixa de um segmento sem ter feito busca direta no Google Maps do bairro.**
>
> Doctoralia, Buritis Juntos, Associação Bairro Buritis e conselhos profissionais **subestimam** a oferta real.
> Catálogos online só capturam quem paga assinatura ou se cadastrou ativamente.
>
> Para CADA modalidade citada como "carência" ou "oferta baixa":
> 1. Buscar `[modalidade] [bairro] [cidade]` no Google Maps
> 2. Ler a página de listagem do "Buritis Juntos" equivalente do bairro quando houver
> 3. Confirmar com 2ª fonte (ABB, Doctoralia, GuiaMais, Apontador, site próprio)
> 4. Se em dúvida → escrever "oferta enxuta" ou "poucos players conhecidos" em vez de "zero"

---

## Estrutura do Output (18 slides PPTX + ~7 seções HTML)

**HTML/PPTX seguem a mesma estrutura editorial:**

1. **Capa** · "O que cabe em [BAIRRO]?" + 8 stats hero (população, m², valorização, etc.)
2. **Resumo Executivo** · diagnóstico do bairro em 1 parágrafo
3. **§01 · O Bairro** · 6 cards demográficos (IBGE Censo 2022, valor m², perfil)
4. **§02 · O Setor** · 6 tendências macro Brasil (ANS, Sebrae, OMS, COFFITO, Doctoralia, Ipsos)
5. **§03 · Mapa de Modalidades** · TABELA com 40 modalidades agrupadas em 7 categorias:
   - A. Médico generalista & especialidades (13)
   - B. Saúde mental (2)
   - C. Odontologia (4)
   - D. Movimento & reabilitação (7)
   - E. Estética & wellness (6)
   - F. Bem-estar especializado (3)
   - G. Apoio (5)
   - Cada linha: nº · modalidade · quantidade · status · exemplos com endereço · fonte
6. **§03.1 · Síntese** · 3 cards (saturadas / alta densidade / oferta enxuta) + descoberta do "eixo dominante" do bairro
7. **§04 · Tese do Upgrade** · pivô narrativo: lojas como upgrade premium, não como start
8. **§04.1 · Antes × Depois** · comparativo "sala em prédio" vs. "loja térrea premium"
9. **§04.2 · Personas Alvo** · 3 cards (profissional estabelecido / marca em expansão / sociedade de profissionais)
10. **§05 · Lojas** · uma seção por loja com vocação + 5 perfis target com contagem de concorrentes que poderiam migrar
11. **§06 · Metodologia** · 4 etapas (base populacional → Google Maps → conselhos → validação in loco)
12. **§07 · Fontes** · 22+ fontes com link clicável

---

## Design tokens (paleta editorial dark/paper)

```
--bg/ink: #0f1410      (dark fundo)
--paper:  #f5f1e8      (creme fundo)
--moss:   #3d5240      (verde profundo · acento)
--olive:  #b6c39d      (verde claro · destaque)
--copper: #c66a3a      (cobre · CTA · números)
--gold:   #c9a449      (gold · status médio)
--danger: #8a2f23      (vermelho · status saturado)

Fontes:
- Display: Fraunces (HTML) / Georgia (PPTX)
- Body:    Inter Tight (HTML) / Calibri (PPTX)
- Mono:    DM Mono (HTML) / Consolas (PPTX)
```

---

## Como usar para um novo bairro

1. Ler `checklist_pesquisa.md`
2. Coletar dados demográficos do novo bairro (IBGE Cidades + Wikipedia local + mercado imobiliário)
3. Rodar o agente de pesquisa (`Agent` com prompt do checklist) para mapear 40 modalidades
4. Copiar `template_html.html` → renomear → substituir dados do Buritis pelos do novo bairro
5. Copiar `template_pptx.js` → renomear → substituir dados → rodar `node template_pptx.js`
6. Validar visualmente os slides antes de entregar
7. Pedir ao cliente para verificar 3-4 categorias via Google Maps in loco antes de cravar números

---

**Última atualização:** 25 de maio de 2026 · pós-validação Buritis com 11 ciclos de correção
