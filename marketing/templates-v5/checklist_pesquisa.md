# Checklist · Pesquisa de Mercado V5 (passo-a-passo)

Use este checklist para CADA novo bairro/cidade. Estimativa: 3-5 horas do início ao deliverable.

---

## Fase 1 · Demografia do bairro (30 min)

Buscar e anotar:

- [ ] **População total** (IBGE Censo 2022 · `cidades.ibge.gov.br`)
- [ ] **Número de domicílios** (IBGE)
- [ ] **Crescimento populacional** entre 2010 e 2022 (em %)
- [ ] **Posição no ranking de bairros da cidade** (mais populoso? mais procurado? — buscar mídia local)
- [ ] **Valor médio do m² 2025/2026** (Portas · `portas.com.br` · Diário do Comércio · QuintoAndar)
- [ ] **Valorização recente do m²** (% nos últimos 12 meses)
- [ ] **Perfil socioeconômico** (faixa de renda, perfil familiar, regional da cidade)
- [ ] **Bairros vizinhos** que também são clientes potenciais

---

## Fase 2 · Pesquisa profunda Google Maps (1-2 horas)

Use o agente `general-purpose` com este prompt-base (adaptar bairro/cidade):

```
Mapear, para cada uma das 40 modalidades abaixo, quantos players ativos existem no bairro [X],
[CIDADE] - [UF]. Use Google search com "[modalidade] [bairro] [cidade]".
Cruzar com pelo menos 2 fontes (Google Maps + ABB/Doctoralia/site próprio/Apontador).

Para cada modalidade retornar:
- Faixa de quantidade (0, 1-2, 3-5, 6-10, 10+, 20+, 30+)
- 2-4 nomes de referência com endereço
- Fonte com link
- Veredito (carência / pouca / média / alta / saturada)

40 modalidades:
A. Médico: clínica multi · clínico geral · pediatria · ginecologia · cardiologia · ortopedia
   · dermatologia · oftalmologia · otorrino · endocrinologia · gastro · neurologia · urologia
B. Saúde mental: psicologia · psiquiatria
C. Odontologia: geral · implantodontia · ortodontia · harmonização orofacial
D. Movimento: fisioterapia · pilates · quiropraxia/osteopatia · acupuntura · crossfit · yoga · academia
E. Estética/wellness: estética avançada · spa/massagem · tricologia · drenagem/criolipólise · depilação a laser · esmalteria
F. Bem-estar: nutrição · personal trainer · recovery
G. Apoio: farmácia manipulação · diagnóstico imagem · laboratório · veterinária · geriatria

Retornar tabela markdown.
```

Depois da tabela:
- [ ] **Sintetizar** quais 3 categorias estão MAIS saturadas (>10 players)
- [ ] **Sintetizar** quais 3 categorias têm MENOS oferta (1-2 players)
- [ ] **Identificar o eixo dominante** do bairro — qual rua/avenida concentra mais clínicas
- [ ] **Identificar a rua das lojas** e qual posição relativa ela ocupa

---

## Fase 3 · Validação in loco com o cliente (30 min)

**REGRA DE OURO V5**: nunca afirmar "zero" sem validar.

Para CADA categoria que aparece como "carência" ou "oferta enxuta" no Fase 2, pedir ao cliente:

- [ ] Print do Google Maps da busca "[modalidade] [bairro] [cidade]"
- [ ] Ajustar contagem na hora se cliente identificar players que o agente não capturou
- [ ] Re-classificar veredito se necessário

Se o cliente identificar 3+ players → REMOVER do ranking de oportunidades. Mover para o mapa geral
como "alta densidade".

---

## Fase 4 · Pivô estratégico (15 min)

Baseado nos dados, escolher 1 das narrativas:

| Cenário | Narrativa | Quando usar |
|---|---|---|
| **Carência real** | "X está em falta no bairro" | Apenas se 2-3 gaps reais sobreviverem à validação |
| **Polo maduro (default V5)** | "Bairro é polo consolidado · lojas são upgrade premium" | Default · use quando bairro tem 30+ modalidades cobertas |
| **Híbrido** | "Polo maduro em categorias X + carência em Y" | Quando há 1-2 gaps fortes + saturação no resto |

---

## Fase 5 · Gerar o HTML (1 hora)

- [ ] Copiar `template_html.html` da pasta de templates
- [ ] Substituir placeholders:
   - `[BAIRRO]`, `[CIDADE]`, `[UF]`
   - Stats demográficos do hero
   - Tabela de 40 modalidades com os dados do Fase 2
   - 3 personas alvo (adaptar exemplos para perfil do novo bairro)
   - Vocação de cada loja com os vizinhos imediatos reais
   - Fontes com links reais

---

## Fase 6 · Gerar o PPTX (30 min)

```bash
cd "[pasta da pesquisa]"
cp "[caminho dos templates]/template_pptx.js" build_pptx.js
# Editar build_pptx.js: trocar dados do Buritis pelos do novo bairro
npm install pptxgenjs   # se ainda não instalado
node build_pptx.js
```

- [ ] Abrir o PPTX e validar visualmente os 18 slides
- [ ] Verificar overlap, cortes, espaçamentos
- [ ] Re-rodar até ficar limpo

---

## Fase 7 · Entrega ao cliente (15 min)

- [ ] Salvar HTML e PPTX na pasta `02 - Pesquisa [Bairro]/`
- [ ] Compartilhar com cliente (link drive ou WhatsApp)
- [ ] Marcar revisão trimestral

---

## Tempo total estimado: 3h30 a 5h

Caso fundador: **Buritis maio/2026** levou 11 ciclos de correção — o padrão final foi atingido com
todas as categorias validadas in loco. Para novos bairros, planejar 2-3 ciclos de correção.
