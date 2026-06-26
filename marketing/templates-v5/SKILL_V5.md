---
name: analise-mercado-oliveira
description: >
  Skill de inteligência comercial da Oliveira Imóveis para análise estratégica de pontos comerciais vagos.
  Use SEMPRE que Vanessa ou um cliente mencionar: "loja vaga", "ponto comercial disponível", "o que colocar
  nessa loja", "qual negócio funciona aqui", "pesquisa de mercado do bairro", "análise da região",
  "perfil do público", "concorrentes próximos", "que tipo de negócio alugar", "estudo do entorno",
  "o que falta no bairro", "para quem anunciar", "análise de mercado para loja", "análise de mercado",
  "análise comercial", "plano de campanhas para loja", "campanha para ponto comercial" ou qualquer variação
  que indique a necessidade de descobrir o melhor tipo de negócio para ocupar um espaço comercial.
  Também acione quando o cliente tiver uma loja vaga em qualquer cidade do Brasil (não apenas BH).
  Esta skill entrega: HTML editorial + PPTX 18 slides com mapa de 40 modalidades verificado via Google Maps,
  tese de upgrade premium, personas alvo e plano de campanhas.
---

# Análise de Mercado V5 — Oliveira Imóveis

Skill de inteligência comercial para identificar o melhor tipo de negócio para um ponto comercial vago.

**Versão:** V5 (default a partir de mai/2026)
**Caso fundador:** Buritis · Lojas 15 e 16 Portofino Street Mall · 11 ciclos de correção
**Templates:** `Marketing Oliveira/00 - Templates Padrao Pesquisa V5/`

---

## Regra de Ouro V5 (não negociável)

> **Nunca afirmar "zero" ou contagem baixa de um segmento sem ter feito busca direta no Google Maps do bairro.**
>
> Doctoralia, catálogos locais e conselhos profissionais **subestimam massivamente** a oferta real — só capturam quem paga assinatura.
> Para CADA modalidade que aparecer como "carência" no mapeamento inicial:
> 1. Buscar `[modalidade] [bairro] [cidade]` no Google Maps
> 2. Cruzar com pelo menos 2ª fonte
> 3. Pedir validação visual do cliente (screenshot)
> 4. Em dúvida → escrever "oferta enxuta" ou "poucos players conhecidos" em vez de "zero"

Caso histórico de erro: análise Buritis v4 afirmou "zero clínica de fisioterapia"; Vanessa validou e mostrou 6+ clínicas. v5 corrigiu o método.

---

## Princípio Central · Mensagem para o Cliente Final

> O público-alvo das lojas Oliveira em centros comerciais **não é o empreendedor iniciante**.
> É o **profissional já estabelecido** que opera em espaço inadequado (sala em prédio, casa adaptada,
> garagem) e quer **migrar** para ambiente premium.
>
> A mensagem nunca é "venha abrir seu negócio aqui".
> A mensagem é: **"Seu negócio já funciona. Agora mereça o espaço certo."**

Este princípio orienta toda a tese (upgrade premium), as personas e o tom dos anúncios.

---

## Fluxo Padrão V5 — 7 fases (3-5h total)

### Fase 1 · Demografia (30 min)

Coletar:
- População total (IBGE Censo 2022 · `cidades.ibge.gov.br`)
- Domicílios + crescimento populacional 2010-2022
- Posição no ranking de bairros da cidade
- Valor médio do m² 2025/2026 (Portas, Diário do Comércio, QuintoAndar)
- Valorização % nos últimos 12 meses
- Perfil socioeconômico
- Bairros vizinhos clientes potenciais

### Fase 2 · Pesquisa profunda Google Maps (1-2h)

Delegar a um agente `general-purpose` com prompt-base (ver `checklist_pesquisa.md`).

**40 modalidades obrigatórias** em 7 categorias:
- **A. Médico** (13): clínica multi, clínico geral, pediatria, ginecologia, cardiologia, ortopedia, dermatologia, oftalmologia, otorrino, endocrinologia, gastro, neurologia, urologia
- **B. Saúde mental** (2): psicologia, psiquiatria
- **C. Odontologia** (4): geral, implantodontia, ortodontia, harmonização orofacial
- **D. Movimento** (7): fisioterapia, pilates, quiropraxia/osteopatia, acupuntura, crossfit, yoga, academia
- **E. Estética/wellness** (6): estética avançada, spa/massagem, tricologia, drenagem/criolipólise, depilação laser, esmalteria
- **F. Bem-estar** (3): nutrição, personal trainer, recovery
- **G. Apoio** (5): farmácia manipulação, diagnóstico imagem, laboratório, veterinária, geriatria

Para cada uma: faixa (0, 1-2, 3-5, 6-10, 10+, 20+, 30+) · 2-4 nomes com endereço · fonte · veredito.

### Fase 3 · Validação in loco (30 min)

Para cada categoria com veredito "carência" / "pouca", pedir print Google Maps ao cliente.
Ajustar números em tempo real.

### Fase 4 · Pivô estratégico (15 min)

Escolher 1 das narrativas:

| Cenário | Narrativa | Quando usar |
|---|---|---|
| Carência real | "X está em falta no bairro" | 2-3 gaps reais sobrevivem à validação |
| **Polo maduro (default V5)** | "Polo consolidado · lojas são upgrade premium" | Bairro tem 30+ modalidades cobertas |
| Híbrido | "Polo maduro em X + carência em Y" | 1-2 gaps fortes + saturação no resto |

### Fase 5 · HTML editorial (1h)

Copiar `template_html.html` → trocar dados do Buritis pelos do novo bairro.

**Estrutura obrigatória (7 seções):**
1. Hero "O que cabe em [BAIRRO]?" + 8 stats
2. Resumo Executivo
3. §01 Demografia (6 cards)
4. §02 Setor Brasil (6 trends macro)
5. §03 Mapa de 40 modalidades (TABELA · core)
6. §04 Tese do Upgrade (antes × depois + personas)
7. §05 Lojas individuais
8. §06 Metodologia + §07 Fontes

### Fase 6 · PPTX 18 slides (30 min)

Copiar `template_pptx.js` → editar dados → `node template_pptx.js`.

**Slides:**
1. Capa
2. Resumo Executivo
3. Demografia
4. Mercado Brasil
5-9. Tabela de 40 modalidades (5 slides)
10. Síntese saturação + eixo dominante
11. Pivô Tese Upgrade
12. Antes × Depois
13. Personas (3 cards)
14-15. Lojas individuais
16. Metodologia
17. Fontes
18. Fechamento

**Design tokens (dark/paper editorial):**
- Cores: `#0f1410` (ink) · `#f5f1e8` (paper) · `#b6c39d` (olive) · `#c66a3a` (copper)
- Fontes: Fraunces/Georgia (display) · Inter/Calibri (body) · DM Mono/Consolas

### Fase 7 · Entrega (15 min)

Salvar HTML + PPTX em `02 - Pesquisa [Bairro]/` · entregar ao cliente · revisão trimestral.

---

## Copy dos 3 Primeiros Segundos (para anúncios)

Para cada nicho recomendado, gerar OBRIGATORIAMENTE 3 hooks:

### Fórmula A · Identidade + Lacuna
`"Você é [profissão]. [Bairro] tem [N] [concorrente] e zero [lacuna]. [CTA]."`

### Fórmula B · Dado bruto sem preâmbulo
`"[N] [tipo de negócio] em [raio]km do [bairro]. [Diagnóstico]. [Loja = solução]."`

### Fórmula C · POV
`"POV: você descobre que [superlativo do bairro] não tem [negócio do espectador]."`

**Regra:** começar pela palavra que prende o profissional (nunca "Olá", "Sabia que").

---

## Templates disponíveis

Pasta: `Marketing Oliveira/00 - Templates Padrao Pesquisa V5/`

| Arquivo | Uso |
|---|---|
| `template_html.html` | Base do entregável principal |
| `template_pptx.js` | Script de geração do PPTX (Node.js + pptxgenjs) |
| `checklist_pesquisa.md` | Passo-a-passo detalhado |
| `README.md` | Visão geral |

---

## Aplicações futuras (qualquer cidade/bairro)

O padrão V5 funciona para **qualquer bairro de qualquer cidade do Brasil**.
Adaptar apenas:
- Dados demográficos do IBGE Censo do novo bairro
- Lista de modalidades (ajustar se for ponto comercial não-saúde — ex: gastronomia, moda, serviços)
- Personas alvo locais
- Vocação das lojas conforme vizinhos imediatos

**Bairros já analisados pela Oliveira:**
- Buritis (BH) · v3, v4, v5 · maio 2025-2026 · saúde & wellness
- Serra/Palmira (BH) · v1 · Centro Comercial Iracema
- Aplicar V5 daqui em diante.

---

**Status:** V5 é o **padrão default** para toda nova pesquisa a partir de 25 de maio de 2026.
Substituir versões anteriores quando o cliente solicitar nova análise.
