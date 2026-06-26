# Skill: Pesquisa de Mercado para Lojas — Oliveira Imóveis

## Quando usar
Quando o cliente estiver avaliando um ponto comercial (loja, franquia, clínica, serviço) e precisar de análise de viabilidade antes de assinar contrato de locação.

## Metodologia V5 Oliveira Imóveis

### 1. Entrevista estruturada (coleta antes de pesquisar)
Coletar ANTES de qualquer pesquisa:
- Segmento / produto / franquia
- Ticket médio alvo e mix de preços
- Público-alvo (classe social, perfil)
- Experiência do empresário no segmento
- Meta de faturamento (mês 1, meta 6 meses)
- Área mínima necessária
- Critérios de localização valorizados pelo cliente

### 2. Análise do bairro
- População (IBGE Censo mais recente)
- Perfil socioeconômico
- Valor do m² (posicionamento relativo na cidade)
- Bairros vizinhos no catchment (raio 3–5km)

### 3. Mapeamento de concorrência — obrigatório via Google Maps
**REGRA INVIOLÁVEL:** Verificar TODOS os concorrentes via Google Maps antes de afirmar "território virgem". Buscar:
- Nome do segmento + bairro
- Endereço exato, nota, número de avaliações, horário de funcionamento, site
- Classificar por eixo geográfico (mesmo eixo / eixo perpendicular / polo consolidado)
- Para cada concorrente: nível de ameaça (ALTA / MÉDIA / BAIXA) com justificativa

**Insight aprendido (caso Ótica Rodrigo):** Concorrente com nota 3,5 e poucos reviews no mesmo eixo = oportunidade, não obstáculo. Confirma demanda existente + gap de qualidade.

### 4. Ecossistema de referral
Mapear via Google Maps:
- Médicos / clínicas / labs do segmento no bairro
- Âncoras de fluxo (supermercados, farmácias, academias)
- Parceiros potenciais (material de ponto, convênio, indicação)
- Prioridade: players com alto volume de avaliações = alto fluxo de pessoas

### 5. Análise financeira
- Custo fixo total do imóvel (aluguel + condomínio + IPTU)
- Breakeven em nº de vendas/mês (custo fixo total ÷ ticket médio)
- Curva de ramp-up: meses 1–3, 4–6, 6+
- Payback estimado
- % aluguel/faturamento por fase (saudável: <8%)

### 6. Score V5
Escala 0–10. Score ≥ 7,5 = FAVORÁVEL. Fatores:
- Demanda comprovada no eixo
- Força da concorrência direta
- Qualidade do ecossistema de referral
- Viabilidade financeira do ponto
- Diferencial do imóvel (âncora, fluxo, estacionamento)

### 7. 3 Condições para o sucesso
Sempre terminar com 3 ações concretas que o empresário precisa tomar para o score se confirmar.

### 8. Disclaimer obrigatório
Todo relatório deve conter:
> "Esta pesquisa foi elaborada pela Oliveira Imóveis como instrumento de inteligência de mercado. Não constitui garantia de resultado, rentabilidade ou sucesso do empreendimento. A decisão final é de responsabilidade exclusiva do empreendedor."

---

---

## Prompt Geral — Plataforma Oliveira Imóveis

### Questões (inputs do cliente na plataforma)

| # | Variável | Pergunta para o cliente |
|---|---|---|
| 1 | `{{segmento}}` | Qual é o seu segmento / produto / franquia? |
| 2 | `{{tipo_operacao}}` | Este ponto é para começar seu primeiro negócio ou para expandir uma operação que já existe? |
| 3 | `{{experiencia}}` | Você já tem experiência neste segmento? Se sim, há quanto tempo? |
| 4 | `{{publico_alvo}}` | Quem é o seu público-alvo? (classe social, perfil, idade) |
| 5 | `{{criterios_localizacao}}` | O que é mais importante para você na localização? *(Marque quantas opções necessárias)*<br>☐ Fluxo de pedestres<br>☐ Estacionamento<br>☐ Visibilidade<br>☐ Bairro específico<br>☐ Precisa estar próximo de concorrentes<br>☐ Portaria 24 horas<br>☐ Elevador |
| 6 | `{{visibilidade_ponto}}` | Para seu negócio você precisa de visibilidade direta para a rua ou uma sala comercial? |
| 7 | `{{regiao_preferida}}` | Em qual região / bairro pensa em implantar este empreendimento? |
| 8 | `{{area_minima}}` | Qual é a área mínima necessária para o seu negócio? (m²) |
| 9 | `{{custo_imovel}}` | Qual o valor de aluguel + condomínio + IPTU que pretende pagar? (R$) |
| 10 | `{{meta_ano1}}` | Qual é a sua meta de faturamento para o 1º ano? |
| 11 | `{{meta_ano2}}` | Qual é a sua meta de faturamento para o 2º ano? |
| 12 | `{{ticket_medio}}` | Quanto cada cliente gasta, em média, numa única visita ou compra no seu negócio? (ex: se você é dentista e cobra R$200 por consulta, esse é o seu valor médio por cliente. Se vende roupas e a maioria das compras fica entre R$100 e R$300, coloque R$200) ⚠️ **Pergunta condicional — exibir somente se `{{tipo_operacao}}` = "expandir operação existente"** |

### Lógica Condicional — Instrução para o Desenvolvedor (Daniel)

> **Regra da pergunta 12 — ticket médio:**
> - Se `{{tipo_operacao}}` = **"primeiro negócio"** → **não exibir a pergunta 12**. O cliente não terá essa informação. Neste caso, `{{ticket_medio}}` = `"não informado — usar média do setor"`.
> - Se `{{tipo_operacao}}` = **"expandir operação existente"** → exibir a pergunta 12 normalmente.
>
> **O que o Clóvis faz quando ticket_medio = "não informado":**
> Na Etapa 4 (Análise Financeira), buscar a média de ticket médio do setor `{{segmento}}` em BH/Brasil para usar no cálculo do breakeven. Citar a fonte da referência utilizada.

### Prompt Template (enviado ao Claude/Clóvis com variáveis substituídas)

```
Você é Clóvis, especialista em pesquisa de mercado da Rede Oliveira Imóveis.

Execute uma pesquisa de mercado completa seguindo a Metodologia V5 Oliveira Imóveis para o empresário abaixo.

DADOS DO EMPRESÁRIO E NEGÓCIO:
- Segmento / produto / franquia: {{segmento}}
- Tipo de operação: {{tipo_operacao}}
- Experiência no segmento: {{experiencia}}
- Público-alvo: {{publico_alvo}}
- Critérios de localização: {{criterios_localizacao}}
- Visibilidade do ponto: {{visibilidade_ponto}}
- Área mínima necessária: {{area_minima}} m²
- Meta de faturamento — 1º ano: {{meta_ano1}}
- Meta de faturamento — 2º ano: {{meta_ano2}}
- Ticket médio: {{ticket_medio}}

INSTRUÇÃO SOBRE TICKET MÉDIO:
Se {{ticket_medio}} = "não informado — usar média do setor", significa que o cliente está abrindo seu primeiro negócio e não possui essa informação. Neste caso, na Etapa 4, pesquise e utilize a média de ticket médio do setor {{segmento}} praticada em BH ou no Brasil. Informe a referência utilizada e deixe claro que é uma estimativa de mercado.

DADOS DO IMÓVEL:
- Região / bairro de preferência: {{regiao_preferida}}
- Custo mensal do imóvel (aluguel + condomínio + IPTU): R$ {{custo_imovel}}

EXECUTE AS 7 ETAPAS OBRIGATÓRIAS:

ETAPA 1 — Análise da Região
- Analisar a região informada: {{regiao_preferida}}
- População do bairro (IBGE Censo mais recente)
- Perfil socioeconômico predominante
- Valor do m² (posicionamento relativo na cidade)
- Bairros vizinhos no catchment (raio 3–5km)

ETAPA 2 — Mapeamento de Concorrência (via Google Maps)
REGRA INVIOLÁVEL: Verificar TODOS os concorrentes via Google Maps antes de qualquer afirmação.
Buscar concorrentes em: {{regiao_preferida}}
Para cada concorrente, levantar:
- Nome, endereço exato, nota, nº de avaliações, horário de funcionamento
- Classificação: mesmo eixo / eixo perpendicular / polo consolidado
- Nível de ameaça: ALTA / MÉDIA / BAIXA com justificativa
Insight: concorrente com nota baixa e poucos reviews no mesmo eixo = oportunidade.

ETAPA 3 — Ecossistema de Referral
Mapear via Google Maps em {{regiao_preferida}}:
- Médicos / clínicas / labs do segmento {{segmento}} no bairro
- Âncoras de fluxo (supermercados, farmácias, academias próximas)
- Parceiros potenciais (convênio, indicação, material de ponto)
- Priorizar players com alto volume de avaliações (= alto fluxo de pessoas)

ETAPA 4 — Análise Financeira
- Custo fixo do imóvel informado: R$ {{custo_imovel}}
- Breakeven em nº de vendas/mês: R$ {{custo_imovel}} ÷ R$ {{ticket_medio}}
- Curva de ramp-up projetada: meses 1–3 / 4–6 / 6+
- Payback estimado do investimento inicial
- % aluguel/faturamento por fase (saudável: <8%)
- Comparar com metas: R$ {{meta_ano1}} (1º ano) e R$ {{meta_ano2}} (2º ano)

ETAPA 5 — Score V5 (escala 0–10)
- Demanda comprovada no eixo
- Força da concorrência direta (inverso)
- Qualidade do ecossistema de referral
- Viabilidade financeira do ponto
- Diferencial da região (âncoras, fluxo, acessibilidade)
Score ≥ 7,5 = FAVORÁVEL · Score 5–7,4 = ATENÇÃO · Score < 5 = DESFAVORÁVEL

ETAPA 6 — 3 Condições para o Sucesso
Liste 3 ações concretas que o empresário deve tomar para o score se confirmar na prática.

ETAPA 7 — Disclaimer
"Esta pesquisa foi elaborada pela Oliveira Imóveis como instrumento de inteligência de mercado. Não constitui garantia de resultado, rentabilidade ou sucesso do empreendimento. A decisão final é de responsabilidade exclusiva do empreendedor."

FORMATO DE ENTREGA:
Relatório completo em Markdown com seções claras, tabela de concorrentes, Score V5 destacado, 3 condições para o sucesso e disclaimer ao final.
```

---

## Output padrão
- Arquivo `.md` em `~/pesquisas/pesquisa-[segmento]-[cliente]-[local]-[data].md`
- Arquivo `.html` com design V5 (hero navy, score verde, cards, tabela de concorrentes, disclaimer)
- Upload no Google Drive → pasta do cliente em Marketing Oliveira

---

## Referências / Casos anteriores
- [Ótica Rodrigo — Loja 15 Portofino, Buritis BH](referencias/caso-otica-rodrigo-buritis-2026-06.md)
