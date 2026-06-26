---
name: mvp-oliveira
description: "Contexto técnico completo do MVP da Rede Oliveira Imóveis — carregue SEMPRE que a conversa envolver qualquer parte deste projeto, mesmo que o usuário não diga o nome. Use ao construir, planejar, revisar ou evoluir qualquer parte do sistema: CRM, banco de dados SQL, n8n, Evolution API, landing page, matching de imóveis, contrato de parceria, credenciais e acessos. Dispare também quando Vanessa ou Daniel perguntarem sobre: fluxo operacional, fases do lead, schema do banco, integração com imobiliárias, senhas do projeto, comissão, próximos passos técnicos, ou qualquer implementação. Gatilhos diretos: 'como funciona o processo?', 'o que Daniel precisa fazer?', 'como o lead chega na imobiliária?', 'qual é a comissão?', 'onde ficam as senhas?', 'qual é o próximo passo?', 'como configurar o n8n?', qualquer menção a Rede Oliveira, Oliveira Imóveis, lp.oliveiraimoveis.ia.br, Daniel de Oliveira Stephensen, ou Evolution API neste contexto."
---

# /mvp-oliveira

Skill de contexto técnico do MVP da **Rede Oliveira Imóveis** — plataforma que conecta empresários ao ponto comercial certo via pesquisa de mercado com IA.

Antes de qualquer implementação, leia este documento inteiro. Ele é a fonte da verdade do projeto.

---

## 1. Visão do Produto

Plataforma que conecta **empresários (lojistas)** ao **ponto comercial certo**, usando pesquisa de mercado com IA como diferencial. A Oliveira atua como intermediária entre quem quer abrir/expandir um negócio e as imobiliárias parceiras.

**Públicos:**
- Empresários buscando ponto comercial (pilates, academia, ótica, pet shop, estética etc.)
- Imobiliárias parceiras com lojas para alugar
- Incorporadoras com centros comerciais com alta vacância (60–80%)

**Diferencial:** pesquisa de mercado v5 especializada em comércio local de BH, executada com IA (Claude). Mais precisa e contextualizada do que um prompt genérico no ChatGPT.

**Modelo de negócio:**
- Fase 1: comissão de 25% do primeiro mês de aluguel
- Fase 2 (escala): SaaS — imobiliárias pagam mensalidade para receber leads qualificados

---

## 2. Fluxo Operacional Completo

```
Meta Ads (Facebook / Instagram)
        ↓
Landing Page — lp.oliveiraimoveis.ia.br
        ↓
Cliente preenche formulário (nome, e-mail, WhatsApp, segmento, momento)
        ↓
n8n recebe webhook → salva lead no banco → aguarda 10 min
        ↓
Evolution API envia mensagem automática de boas-vindas no WhatsApp
        ↓
Equipe Oliveira entra em contato (WhatsApp)
        ↓
Questionário aprofundado respondido pelo cliente
        ↓
Equipe executa pesquisa de mercado com IA (Claude)
        ↓
Equipe faz match com imobiliária parceira (imóvel compatível)
        ↓
        ┌──────────────────────────────────────────┐
        │         ENTREGA SIMULTÂNEA               │
        │  a) Cliente recebe pesquisa de mercado   │
        │     + mensagem: "Temos uma imobiliária   │
        │     com o imóvel que você precisa.       │
        │     Eles vão entrar em contato para      │
        │     agendar a visita."                   │
        │                                          │
        │  b) Imobiliária recebe lead qualificado  │
        │     + pesquisa de mercado completa       │
        │     + dados de contato do cliente        │
        └──────────────────────────────────────────┘
        ↓
Imobiliária agenda e realiza visita com o cliente
        ↓
Fechamento → comissão para a Oliveira
```

> **Regra central:** pesquisa de mercado e repasse do lead à imobiliária acontecem **ao mesmo tempo**. O cliente sabe que a imobiliária vai contatá-lo antes de receber a ligação.

---

## 3. API de Leads (Endpoint Ativo)

**URL para visualizar leads recebidos:** disponível no [documento de senhas](https://docs.google.com/document/d/1xSb1g3KtOfWy-bCrnoSagkGrfhPj3hj1-1IOIxyfQ_E/edit?tab=t.0) (seção "link com os leads").

Endpoint no Cloudflare Workers — retorna todos os leads capturados pela LP em tempo real. Requer parâmetro `?secret=` (ver doc de senhas).

---

## 4. Landing Page — lp.oliveiraimoveis.ia.br

**Headline:** "Quer crescer sua loja no ponto certo?"
**Subheadline:** "Receba gratuitamente uma análise do ponto, do entorno e do potencial comercial antes de expandir."
**CTA:** "Quero minha análise"
**Badges:** R$0 para solicitar · BH e região · Dados antes do contrato

### Campos visíveis do formulário

| Campo | Tipo | Obrigatório | Detalhe |
|---|---|---|---|
| Nome | Texto | Sim | placeholder: "Seu nome" |
| E-mail | E-mail | Sim | placeholder: "seunome@email.com" |
| WhatsApp | Telefone | Sim | placeholder: "(31) 9 0000-0000" |
| Qual é o seu negócio? | Texto livre | Sim | placeholder: "Ex: Pilates, estética, pet shop..." |
| Momento da expansão | Select | Sim | ver opções abaixo |
| Aceite Termos + Privacidade | Checkbox | Sim | — |

**Opções do select "Momento da expansão":**
- Já tenho loja e quero abrir outra unidade
- Quero trocar para um ponto melhor
- Quero testar uma nova região
- Estou avaliando franquia ou expansão

### Campos ocultos (capturados automaticamente)
`utm_source` · `utm_medium` · `utm_campaign` · `utm_id` · `conjunto_anuncios` · `adset_id` · `anuncio` · `ad_id` · `placement` · `fbclid` · `pagina_origem` · `data_aceite`

---

## 5. CRM — Fases do Lead

```
[1] NOVO LEAD
    Formulário preenchido na LP
    → n8n salva no banco e dispara boas-vindas em 10 min

[2] QUESTIONÁRIO ENVIADO
    Equipe enviou questionário aprofundado via WhatsApp
    → Registrar data de envio no CRM

[3] QUESTIONÁRIO RESPONDIDO
    Cliente respondeu
    → Dados completos disponíveis para gerar a pesquisa

[4] PESQUISA EM ANDAMENTO
    Equipe executa pesquisa de mercado com Claude
    → Salvar resultado no CRM (URL do documento)

[5] MATCH COM IMOBILIÁRIA
    Equipe identifica imóvel compatível em imobiliária parceira
    → Registrar: qual imobiliária, qual imóvel, data do match

[6] ENTREGA SIMULTÂNEA  ← etapa-chave
    n8n dispara:
    a) mensagem ao cliente (pesquisa + aviso da imobiliária)
    b) dados do lead para a imobiliária parceira

[7] EM VISITA / NEGOCIAÇÃO
    Imobiliária acompanha o cliente na visita
    → Equipe Oliveira monitora andamento

[8] FECHADO
    Contrato assinado → registrar comissão

[9] PERDIDO
    Lead não converteu → registrar motivo
```

### Dados por lead no CRM

**Da LP (automáticos):** nome · e-mail · WhatsApp · segmento · momento_expansao · UTMs completos · adset_id · ad_id · placement · fbclid · pagina_origem · data_aceite_termos

**Adicionados pela equipe:** respostas do questionário aprofundado · pesquisa de mercado (URL) · imobiliária selecionada · imóvel indicado · responsável interno · histórico de contatos · status

---

## 6. Automação WhatsApp — n8n + Evolution API

### Fluxo 1 — Boas-vindas (10 min após formulário)
```
Webhook LP → n8n recebe dados do lead
    ↓
n8n: salva lead no banco (fase: NOVO_LEAD)
    ↓
n8n: Wait 10 minutos
    ↓
n8n: gera mensagem personalizada com IA
    (usa: nome, segmento, momento_expansao)
    ↓
Evolution API: envia no WhatsApp do cliente
    Modelo: "Oi [Nome]! Recebemos sua solicitação
    de análise para o seu [segmento]. Nossa equipe
    já está separando os dados de BH para você.
    Em breve entramos em contato!"
    ↓
n8n: atualiza fase → CONTATO_REALIZADO
```

### Fluxo 2 — Entrega simultânea (fase 6)
```
Gatilho: equipe marca lead como "Pronto para entrega" no CRM
    ↓
n8n: busca dados do lead + URL da pesquisa de mercado
    ↓
n8n: gera mensagem para o CLIENTE com IA
    ↓
Evolution API: envia ao CLIENTE
    Modelo: "Olá [Nome]! Sua análise de ponto está
    pronta: [link]. Identificamos uma imobiliária
    parceira com o imóvel certo para o seu [segmento]
    em [bairro/região]. Eles vão entrar em contato
    em breve para agendar a visita!"
    ↓
n8n: envia para a IMOBILIÁRIA parceira
    (nome, WhatsApp, segmento, pesquisa, imóvel indicado)
    ↓
n8n: atualiza fase → EM_VISITA
```

---

## 7. Schema do Banco de Dados

### `leads`
```sql
leads
├── id                  UUID          PK
├── criado_em           TIMESTAMP
├── fase                ENUM          novo_lead | questionario_enviado |
│                                     questionario_respondido | pesquisa_andamento |
│                                     match_imovel | entregue | em_visita |
│                                     fechado | perdido
├── responsavel         VARCHAR
├── nome                VARCHAR       NOT NULL
├── email               VARCHAR       NOT NULL
├── whatsapp            VARCHAR       NOT NULL
├── segmento            VARCHAR       (texto livre)
├── momento_expansao    ENUM          ja_tenho_loja | trocar_ponto |
│                                     nova_regiao | franquia_expansao
├── aceite_termos       BOOLEAN
├── data_aceite_termos  TIMESTAMP
├── utm_source          VARCHAR
├── utm_medium          VARCHAR
├── utm_campaign        VARCHAR
├── utm_id              VARCHAR
├── adset_id            VARCHAR
├── ad_id               VARCHAR
├── placement           VARCHAR
├── fbclid              VARCHAR
├── pagina_origem       VARCHAR
├── questionario_id     FK → questionarios.id
├── pesquisa_id         FK → pesquisas.id
└── imovel_id           FK → imoveis.id
```

### `questionarios`
```sql
questionarios
├── id                  UUID          PK
├── lead_id             FK → leads.id
├── criado_em           TIMESTAMP
├── enviado_em          TIMESTAMP
├── respondido_em       TIMESTAMP
└── respostas           JSONB         (perguntas + respostas do questionário aprofundado)
```

### `pesquisas`
```sql
pesquisas
├── id                  UUID          PK
├── lead_id             FK → leads.id
├── criado_em           TIMESTAMP
├── arquivo_url         VARCHAR       (link do PDF/HTML da pesquisa)
├── conteudo            TEXT          (texto completo para busca)
└── gerada_por          VARCHAR       (modelo de IA utilizado)
```

### `imoveis`
```sql
imoveis
├── id                  UUID          PK
├── imobiliaria_id      FK → imobiliarias.id
├── endereco            VARCHAR
├── bairro              VARCHAR
├── regiao              VARCHAR
├── metragem_min        INTEGER       (m²)
├── metragem_max        INTEGER       (m²)
├── aluguel_min         DECIMAL       (R$)
├── aluguel_max         DECIMAL       (R$)
├── tipo_ponto          ENUM          loja_rua | galeria | centro_comercial | outro
├── disponivel          BOOLEAN
├── criado_em           TIMESTAMP
└── atualizado_em       TIMESTAMP
```

### `imobiliarias`
```sql
imobiliarias
├── id                  UUID          PK
├── nome                VARCHAR
├── contato_nome        VARCHAR
├── contato_whatsapp    VARCHAR
├── contato_email       VARCHAR
├── ativa               BOOLEAN
└── criado_em           TIMESTAMP
```

### `historico_contatos`
```sql
historico_contatos
├── id                  UUID          PK
├── lead_id             FK → leads.id
├── criado_em           TIMESTAMP
├── canal               ENUM          whatsapp | email | telefone | sistema
├── direcao             ENUM          enviado | recebido
├── conteudo            TEXT
└── responsavel         VARCHAR
```

---

## 8. Credenciais e Acessos do MVP

**Documento completo de senhas:** [Senhas desenvolvimento — MVP Rede Oliveira](https://docs.google.com/document/d/1xSb1g3KtOfWy-bCrnoSagkGrfhPj3hj1-1IOIxyfQ_E/edit?tab=t.0)

> Senhas não ficam armazenadas aqui. Sempre consultar o Google Doc acima para login.

**CNPJ Oliveira Imóveis:** 26.266.822/0001-02

### Infraestrutura e domínio

| Serviço | Uso | Conta | Detalhes |
|---|---|---|---|
| Cloudflare | LP + Workers (API de leads) | vanessabarbosadeoliveira9@gmail.com | [Dashboard](https://dash.cloudflare.com/669491c12f3d53a3f28ba3270668efaf/home/overview) |
| Registro.br | Domínio oliveiraimoveis.ia.br | oliveiiraimoveis@gmail.com (CNPJ acima) | — |
| GitHub | Código (colaborador: Daniel de Oliveira Stephensen) | vanessabarbosadeoliveira9@gmail.com | — |
| Formspree | Formulário da LP | vanessabarbosadeoliveira9@gmail.com | — |

### Landing pages ativas

| URL | Status |
|---|---|
| https://lp.oliveiraimoveis.ia.br/ | Principal (domínio próprio) |
| https://wispy-field-ab1d.vanessabarbosadeoliveira9.workers.dev/ | Backup (Cloudflare Workers) |

### Automação e CRM

| Serviço | Uso | Conta | Detalhes |
|---|---|---|---|
| n8n | Fluxos de automação WhatsApp | vanessabarbosadeoliveira9@gmail.com | Usuário: `oliveira4828` |
| Evolution API | WhatsApp (integrado ao n8n) | — | Senhas no Google Doc |
| API de leads | Visualizar leads capturados | Cloudflare Workers | URL e secret no Google Doc |

### Marketing e mídia paga

| Serviço | Uso | Conta | IDs |
|---|---|---|---|
| Meta Ads | Campanhas Facebook/Instagram | vanessabarbosadeoliveira9@gmail.com | Business ID: 1419699746475988 · Ad Account: 775982088889277 · [Gerenciador](https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=775982088889277&business_id=1419699746475988) |
| Meta Pixel | Rastreio de conversões LP | — | ID: **26815330474775862** |
| Google Analytics | Métricas do site | — | ID: **G-4YM3X80NZ8** |
| Instagram | Perfil da marca | oliveiiraimoveis@gmail.com | @Oliveiraimoveiis |
| OLX | Anúncios orgânicos | oliveiiraimoveis@gmail.com | — |
| TikTok | Perfil | oliveiiraimoveis@gmail.com | — |
| Facebook | Perfil pessoal Vanessa | vanessabarbosadeoliveira9@gmail.com | 2FA ativo |

### Ferramentas de conteúdo e design

| Serviço | Uso | Conta |
|---|---|---|
| Canva | Design de criativos | diretoria.goiania@ctrlplay.com.br |
| CapCut | Edição de vídeos | midiagoiania@ctrlplay.com.br |
| Reimaginehome | Staging virtual de lojas vazias (colocar móveis em fotos) | marialauraoliveiraofficial@gmail.com |
| Gamma Slides | Apresentações | gerencia.goiania@ctrlplay.com.br |
| Sync.so | Edição de lábio em vídeo | vanessabarbosadeoliveira9@gmail.com |
| Gemini API | Processamento de fotos | vanessabarbosadeoliveria9@gmail.com · Chave no Google Doc |

**Ação pendente:** Vanessa compartilha o Google Doc de senhas com Daniel.

---

## 9. Stack Tecnológico

### Atual (em produção)
| Camada | Tecnologia |
|---|---|
| Site / LP | HTML puro |
| Hospedagem | Cloudflare Pages |
| Domínio | oliveiraimoveis.ia.br (Registro.br) |
| Controle de versão | GitHub — repo: oliveira-imoveis-site (Daniel de Oliveira Stephensen colaborador) |
| IA / pesquisa | Claude (Claude Code) |
| Captação de leads | Meta Ads → LP Cloudflare |
| Leads | WhatsApp apenas (sem banco de dados) |

### A construir
| Camada | Tecnologia definida |
|---|---|
| Banco de dados | SQL (PostgreSQL / Cloudflare D1 — a definir) |
| Automação WhatsApp | n8n + Evolution API |
| Backend / API | A definir por Daniel (desenvolvedor) |
| CRM interno | **Notion** (opção principal) ou custom — a definir com Daniel |
| Integração imobiliárias | API REST com parceiros |

---

## 10. Regras de Negócio Importantes

> **CRM no Notion:** o CRM de acompanhamento de leads pode ser construído diretamente no Notion, usando databases com propriedades para cada fase do pipeline (seção 5). O Notion tem MCP disponível para automação via Claude e integra com n8n via API. Avaliar antes de construir solução custom.



1. **Entrega simultânea é inegociável** — cliente e imobiliária recebem ao mesmo tempo. Nunca entregar para um sem o outro.
2. **Matching começa manual** — equipe faz o match humano nas primeiras semanas para aprender os padrões antes de automatizar filtros.
3. **Pesquisa não é automática** — o formulário captura o lead; a pesquisa só é gerada após o questionário aprofundado respondido.
4. **UTMs devem ser salvos** — todos os parâmetros de rastreio do Meta Ads precisam ser persistidos no banco junto com o lead.
5. **Sem match, sem entrega** — a pesquisa não é enviada ao cliente enquanto não houver imobiliária parceira com imóvel compatível identificada.

---

## 11. Próximos Passos (por prioridade)

| # | Ação | Responsável |
|---|---|---|
| 1 | Webhook da LP → n8n (captura leads no banco) | Daniel |
| 2 | Banco de dados SQL com schema acima | Daniel |
| 3 | Fluxo 1 no n8n (boas-vindas automáticas) | Daniel |
| 4 | Painel CRM básico (lista de leads + fases) — avaliar Notion como base | Daniel |
| 5 | Cadastro de imobiliárias parceiras no banco | Vanessa + Daniel |
| 6 | Fluxo 2 no n8n (entrega simultânea) | Daniel |
| 7 | Drive de senhas técnicas para Daniel | Vanessa |

---

## 12. Contrato de Parceria com Imobiliárias

Arquivo original: `Termo-Parceria-Piloto-Rede-Oliveira.docx`

### Resumo executivo do Termo

| Item | Condição |
|---|---|
| Duração do piloto | 90 dias corridos a partir da assinatura |
| Prorrogação | Mútuo acordo por escrito |
| Rescisão antecipada | 15 dias de aviso prévio por escrito |
| Remuneração | 25% do primeiro mês de aluguel por contrato fechado |
| Mensalidade / taxa de setup | R$ 0,00 durante o piloto |
| Prazo de pagamento | Até 5 dias úteis após recebimento do 1º aluguel |
| Exclusividade da Oliveira | Máx. 2 imobiliárias em BH + RMBH simultaneamente |
| Exclusividade da imobiliária | Nenhuma — pode continuar com canais próprios |
| Propriedade dos leads | Oliveira Imóveis |
| Propriedade dos contratos | Imobiliária parceira |
| Propriedade intelectual da plataforma | Oliveira Imóveis |
| Confidencialidade | Permanente (sem prazo de expiração) |
| Foro | Comarca de Belo Horizonte/MG |

### Obrigações da Oliveira Imóveis
- Pesquisa de mercado com IA para os imóveis cadastrados pela parceira
- Criar, gerenciar e **custear** os anúncios digitais
- Qualificar os leads antes de encaminhar
- Desenvolver a plataforma considerando feedback da parceira
- Manter sigilo sobre portfólio e dados operacionais
- Relatório mensal: leads gerados, encaminhados e contratos fechados

### Obrigações da Imobiliária Parceira
- Fornecer portfólio completo de imóveis comerciais disponíveis (endereço, metragem, valor, disponibilidade)
- Atualizar portfólio sempre que houver mudança
- Atender leads encaminhados com presteza e agendar visitas
- Fornecer feedback sobre o processo durante o piloto
- Manter sigilo sobre metodologias e tecnologias da Oliveira

> Texto completo das cláusulas em [`references/contrato-parceria.md`](references/contrato-parceria.md)

---

## 13. Questionário e Prompt da Pesquisa de Mercado (Clóvis)

A plataforma coleta os dados do cliente via formulário e envia ao Claude/Clóvis para gerar a pesquisa V5.

### Questionário — 12 perguntas (inputs do cliente)

| # | Variável | Pergunta | Observação |
|---|---|---|---|
| 1 | `{{segmento}}` | Qual é o seu segmento / produto / franquia? | |
| 2 | `{{tipo_operacao}}` | Este ponto é para começar seu primeiro negócio ou para expandir uma operação que já existe? | **Condicional** — define se pergunta 12 é exibida |
| 3 | `{{experiencia}}` | Você já tem experiência neste segmento? Se sim, há quanto tempo? | |
| 4 | `{{publico_alvo}}` | Quem é o seu público-alvo? (classe social, perfil, idade) | |
| 5 | `{{criterios_localizacao}}` | O que é mais importante para você na localização? *(Marque quantas opções necessárias)* ☐ Fluxo de pedestres ☐ Estacionamento ☐ Visibilidade ☐ Bairro específico ☐ Próximo de concorrentes ☐ Portaria 24h ☐ Elevador | Múltipla escolha |
| 6 | `{{visibilidade_ponto}}` | Para seu negócio você precisa de visibilidade direta para a rua ou uma sala comercial? | |
| 7 | `{{regiao_preferida}}` | Em qual região / bairro pensa em implantar este empreendimento? | |
| 8 | `{{area_minima}}` | Qual é a área mínima necessária para o seu negócio? (m²) | |
| 9 | `{{custo_imovel}}` | Qual o valor de aluguel + condomínio + IPTU que pretende pagar? (R$) | |
| 10 | `{{meta_ano1}}` | Qual é a sua meta de faturamento para o 1º ano? | |
| 11 | `{{meta_ano2}}` | Qual é a sua meta de faturamento para o 2º ano? | |
| 12 | `{{ticket_medio}}` | Quanto cada cliente gasta, em média, numa única visita ou compra? (ex: dentista R$200/consulta; loja de roupas R$200 média) | ⚠️ **Exibir só se pergunta 2 = "expandir operação existente"** |

### Lógica Condicional — Regra para Daniel

> **Pergunta 12 (ticket médio):**
> - `{{tipo_operacao}}` = **"primeiro negócio"** → **não exibir**. Passar `{{ticket_medio}}` = `"não informado — usar média do setor"` ao prompt.
> - `{{tipo_operacao}}` = **"expandir operação existente"** → exibir normalmente.
>
> **Comportamento do Clóvis quando ticket não informado:** busca média do setor `{{segmento}}` em BH/Brasil, usa no cálculo do breakeven e cita a fonte.

### Prompt Template (enviado ao Clóvis com variáveis substituídas)

Arquivo completo: [`pesquisa-mercado-lojas/prompts/prompt-geral.md`](../pesquisa-mercado-lojas/prompts/prompt-geral.md)

```
Você é Clóvis, especialista em pesquisa de mercado da Rede Oliveira Imóveis.
Execute uma pesquisa de mercado completa seguindo a Metodologia V5 para o empresário abaixo.

DADOS DO EMPRESÁRIO:
- Segmento: {{segmento}} | Operação: {{tipo_operacao}} | Experiência: {{experiencia}}
- Público-alvo: {{publico_alvo}} | Critérios: {{criterios_localizacao}}
- Visibilidade: {{visibilidade_ponto}} | Região: {{regiao_preferida}} | Área: {{area_minima}}m²
- Custo imóvel: R${{custo_imovel}} | Meta ano 1: R${{meta_ano1}} | Meta ano 2: R${{meta_ano2}}
- Ticket médio: {{ticket_medio}}

ETAPAS: 1-Análise da região · 2-Concorrência (Google Maps obrigatório) · 3-Ecossistema referral
        4-Análise financeira (breakeven + ramp-up) · 5-Score V5 (0–10) · 6-3 condições sucesso · 7-Disclaimer
```

---

## 14. Alertas Técnicos

- **Site em HTML único** → Daniel recomenda separar em componentes para reduzir custo de tokens por atualização
- **Sem dados históricos** → sem CRM, impossível aprender padrões de matching
- **Escala depende de imobiliárias** → sem parceiras cadastradas o ciclo não fecha
- **Filtros automáticos prematuros** → podem excluir boas opções; sempre validar manualmente primeiro
