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

### Centralização de leads — LP1 e LP2 apontam para o mesmo Worker

**Confirmado em 26/06/2026:** ambas as landing pages já enviam leads para o mesmo endpoint do Worker. O campo `pagina_origem` identifica de qual LP veio o lead.

| LP | URL | Worker | `pagina_origem` |
|---|---|---|---|
| LP1 — Pesquisa Estratégica | `lp.oliveiraimoveis.ia.br` | `oliveira-pesquisa` | `oliveiraimoveis.ia.br/pesquisa` |
| LP2 — Portofino Street Mall | `wispy-field-ab1d.vanessabarbosadeoliveira9.workers.dev` | `wispy-field-ab1d` | `Portofino Street Mall` |

**Endpoint único (ambas):** `https://oliveira-leads-api.vanessabarbosadeoliveira9.workers.dev/lead`
- Método: `POST`
- Formato: `FormData`
- `keepalive: true` em ambas (garante entrega mesmo quando o usuário navega para o WhatsApp)

**Dashboard centralizado:** `https://oliveira-leads-api.vanessabarbosadeoliveira9.workers.dev/leads?secret=oli2026admin`
- Coluna **"Página"** mostra de qual LP veio o lead
- Todos os UTMs do Meta Ads são capturados (campanha, conjunto, criativo, ad_id, fbclid)

**DNS Cloudflare (`oliveiraimoveis.ia.br`):**
- `lp.oliveiraimoveis.ia.br` → Worker `oliveira-pesquisa` (Proxied)
- `www.oliveiraimoveis.ia.br` → Worker `soft-smoke-c987` (Proxied)

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

> **Atualizado em 28/06/2026** após reunião de demo Daniel → Vanessa (38min, gravação OBS).

### Semana de 30/06/2026 — Daniel

| # | Tarefa |
|---|---|
| 1 | Otimizar portal do cliente para **mobile** (fluxo completo pelo celular) |
| 2 | Publicar sistema no **Cloudflare** (Vanessa precisa acessar o painel) |
| 3 | Subir código no **GitHub** (acesso de visualização para Vanessa) |
| 4 | Adicionar **botão de download em PDF** na tela de resultado da pesquisa |
| 5 | Implementar **drop-down de segmento** no formulário (substituir campo texto livre) |
| 7 | Criar **formulários dinâmicos por segmento** (perguntas mudam conforme categoria) |

### Semana de 30/06/2026 — Vanessa

| # | Tarefa |
|---|---|
| 1 | Criar **prompts específicos por segmento** (Pilates, Odontologia, Pet Shop, Estética, Psicologia etc.) |
| 2 | **Remover nome "Clóvis"** da tela de resultado — substituir por identificação neutra (ex: "Análise de Mercado") |
| 3 | **Corrigir erro de cálculo no score** — o divisor deve ser 11 (soma dos pesos), não 10. Score exibido ~9 quando o correto é ~8 |
| 4 | Adicionar status **"Entrou em contato"** no painel de leads (para Brenda filtrar quem já foi abordado) |
| 5 | Revisar e atualizar **textos da Landing Page** (remover referências a "compra e venda", não é o posicionamento correto) |
| 6 | Contatar mais **parceiros imobiliários** para ampliar portfólio de pontos (ex: Tio Rodrigo) |

### Backlog (sem prazo definido)

| # | Tarefa | Responsável |
|---|---|---|
| 1 | Webhook da LP → n8n (captura leads no banco) | Daniel |
| 2 | Banco de dados SQL com schema da seção 7 | Daniel |
| 3 | Fluxo n8n boas-vindas automáticas | Daniel |
| 4 | Painel CRM (lista de leads + fases) — avaliar Notion | Daniel |
| 5 | Cadastro de imobiliárias parceiras | Vanessa + Daniel |
| 6 | Fluxo n8n entrega simultânea | Daniel |
| 7 | Validar com primeiros leads o que precisam | Vanessa |

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

## 14. Termos de Uso — Isenção sobre Pesquisa de Mercado

**Atualizado em 26/06/2026:** ambas as LPs possuem cláusula **4.1 — Isenção de responsabilidade sobre a pesquisa de mercado** nos Termos de Uso.

Conteúdo da cláusula:
- A pesquisa é fornecida por livre e espontânea vontade do usuário
- Não constitui consultoria financeira, imobiliária ou jurídica
- Resultados e projeções são estimativas sujeitas a variações de mercado não controláveis pela Oliveira Imóveis
- A decisão de abrir, expandir ou manter um negócio é responsabilidade exclusiva do usuário
- Oliveira Imóveis não se responsabiliza por perdas decorrentes do uso ou interpretação da pesquisa

**Localização nos arquivos:**
- LP1 (`lp.oliveiraimoveis.ia.br`): modal "Termos de Uso" em `oliveira-lp-leads/public/index.html`
- LP2 (`wispy-field-ab1d`): página `/termos-de-uso` em `oliveira-portofino-next/app/termos-de-uso/page.js`

---

## 15. Alertas Técnicos

- **Site em HTML único** → Daniel recomenda separar em componentes para reduzir custo de tokens por atualização
- **Sem dados históricos** → sem CRM, impossível aprender padrões de matching
- **Escala depende de imobiliárias** → sem parceiras cadastradas o ciclo não fecha
- **Filtros automáticos prematuros** → podem excluir boas opções; sempre validar manualmente primeiro

---

## 16. Decisões de Produto — Demo 28/06/2026

Decisões tomadas na reunião de demo Daniel → Vanessa (38min, OBS).

### UX / Formulário
- **Campo "segmento" vira drop-down** com categorias pré-definidas. Cada categoria carrega prompt específico e formulário de perguntas dinâmico
- **Formulários dinâmicos por segmento:** perguntas diferentes para Pilates, Odontologia, Pet Shop etc.
- **Painel admin é só desktop** — portal do cliente deve ser otimizado para celular

### Resultado da Pesquisa
- **Remover nome "Clóvis"** do cabeçalho do resultado — substituir por identificação neutra. Risco: usuário percebe que é IA automática e desconfia se vê uma "pessoa"
- **Adicionar botão de download em PDF** no resultado
- **Corrigir divisor do score:** pesos somam 11, divisor estava em 10 → score exibido ~9 quando correto é ~8

### Modelo de Negócio
- **Pesquisas gratuitas** por enquanto — foco em captura de leads; monetização via locação do ponto comercial
- Cobrança por pesquisas adicionais é tecnicamente viável mas postergada

### Painel de Leads
- **Adicionar status "Entrou em contato"** para Brenda (SDR) filtrar leads já abordados
- Caso de uso: Brenda abre painel → vê lead → lê dados + análise gerada → liga com contexto rico

### IA e Arquitetura
- **A IA não aprende automaticamente** com cada pesquisa gerada — é um modelo externo (Claude/GPT) que recebe o prompt V5 a cada chamada
- Melhoria de qualidade = refinamento manual do prompt por Vanessa
- **Fine-tuning** (IA aprender com os dados dos clientes) = projeto de 6+ meses, requer equipe especializada, alto custo → fora do escopo atual
- O que Vanessa chama de "skill" é tecnicamente o **prompt** — o texto de instrução passado à IA. São a mesma coisa

### Visão de Futuro (postergada)
- **Agente autônomo** que atende clientes sozinho: viável mas é outro projeto. Estimativa Daniel: 6 meses a 1 ano com equipe dedicada
- **Avatar/persona de IA** para mobile: complexo, não vale a pena agora
- Foco atual: validar MVP com usuários reais antes de escalar

---

## 17. Planejamento de Viabilidade Econômica — Plataforma

> **Gerado em Jun/2026** com base em premissas estimadas. Revisar quando houver dados reais do piloto (CPL real, taxa de conversão real, ticket SaaS validado).

### Premissas do modelo (a validar com o piloto)

| Premissa | Valor estimado | O que medir no piloto |
|---|---|---|
| CPL Meta Ads BH | ~R$33/lead | Custo real por lead qualificado |
| Taxa de conversão | 2–2,5% (lead → contrato) | Quantos leads viraram fechamento |
| Aluguel médio comercial | R$3.000/mês | Ticket médio real dos imóveis fechados |
| Comissão por deal | R$750 (25% × R$3.000) | Comissão real recebida por fechamento |
| Ticket SaaS | R$1.000/imobiliária/mês | Disposição a pagar das imobiliárias |
| Ramp SaaS | 3 novas imobiliárias/mês (com SDR) | Tempo real de negociação B2B |
| Ciclo de venda | 45–60 dias (lead → fechamento) | Medir tempo médio real |

### Cenário Conservador — R$20K capital

- **Ads:** R$2.500/mês | **Leads:** ~75/mês | **Deals:** 1→8/mês (ramp 18 meses)
- **SaaS:** inicia Jan/2028 (separação das empresas) | Cresce 1 imobiliária/mês
- **Equipe:** estagiário R$1.800 (Ago/26) → tech CLT R$6.300 (Jul/28)

| Período | Resultado | Acumulado |
|---|---|---|
| Ano 1 Jul/26–Jun/27 | –R$30.600 | –R$30.600 |
| Ano 2 Jul/27–Jun/28 | +R$4.900 | –R$25.700 |
| Ano 3 Jul/28–Jun/29 | +R$85.200 | +R$59.500 |
| Ano 4 Jul/29–Jun/30 | +R$167.600 | +R$227.100 |
| Ano 5 Jul/30–Jun/31 | +R$144.000 | +R$371.100 |

- Break-even mensal: **Set/2027** | Acumulado zerado: **Jan/2029**
- Pico do déficit: –R$35.000 | Capital R$20K cobre só os primeiros 4–5 meses

### Cenário Acelerado — R$150K capital ⭐ recomendado

- **Ads:** R$15.000/mês | **Leads:** ~450/mês | **Deals:** 11/mês a partir Set/26
- **SDR B2B:** R$3.500/mês a partir Out/26 (assina imobiliárias) → 3 novas/mês
- **SaaS:** inicia Out/2026 (3 meses após início das operações)
- **30 imobiliárias atingidas:** Ago/2027 (apenas 13 meses do zero)

| Período | Imobiliárias | Resultado | Acumulado |
|---|---|---|---|
| Ano 1 Jul/26–Jun/27 | 0→25 | –R$32.300 | –R$32.300 |
| Ano 2 Jul/27–Jun/28 | 25→30 | +R$191.800 | +R$159.500 |
| Ano 3 Jul/28–Jun/29 | 30 | +R$87.600 | +R$247.100 |
| Ano 4 Jul/29–Jun/30 | 30 | +R$46.800 | +R$293.900 |
| Ano 5 Jul/30–Jun/31 | 30 | +R$43.800 | +R$337.700 |

- Break-even mensal: **Fev/2027** (mês 8) | Acumulado zerado: **Ago/2027** (mês 13)
- Pico do déficit: –R$63.050 em Jan/2027 | Capital R$150K → **folga de R$87.000**
- MRR máximo: R$30.000/mês (SaaS) + R$8.250 (comissão) = **R$38.250/mês**

### Comparativo dos cenários

| Marco | R$20K | R$150K | Diferença |
|---|---|---|---|
| Break-even mensal | Set/2027 | Fev/2027 | 7 meses mais rápido |
| Acumulado zerado | Jan/2029 | Ago/2027 | **16 meses mais rápido** |
| 30 imobiliárias | Jun/2030 | Ago/2027 | 35 meses mais rápido |
| Receita Ano 1 | R$24.000 | R$208.000 | 8,7× mais |
| Resultado Ano 2 | +R$4.900 | +R$191.800 | — |

### Sobre avatar de IA e fine-tuning

- **n8n + Claude + Evolution API = avatar gratuito** — já no roadmap do Daniel, cobre o fluxo automático completo (recebe lead → questionário → pesquisa → entrega). Não há necessidade de construir avatar customizado agora.
- **Fine-tuning que aprende com pesquisas:** requer R$300K+ e equipe de dados. Faz sentido apenas com 2.000+ leads/mês e histórico de 12+ meses de pesquisas geradas.
- **Avatar com voz/persona (ElevenLabs):** R$500–2.000/mês. Só após validar o produto com usuários reais.
- **Quando o avatar faz sentido:** > 500 leads/mês → nesse ponto o processo manual vira gargalo.

### Gatilhos para reavaliação do modelo

Quando tiver dados do piloto, revisar as premissas acima comparando:
1. **CPL real** vs R$33 estimado — ajustar budget de ads necessário
2. **Conversão real** vs 2–2,5% — se for 1%, break-even atrasa ~4 meses; se for 4%, adianta
3. **Ticket real dos imóveis** vs R$3.000 — cada +R$1.000 no aluguel médio = +R$250/deal
4. **Disposição a pagar das imobiliárias** — se aceitam R$1.500 em vez de R$1.000, break-even SaaS cai de 5 para 3 agências
5. **Tempo de negociação B2B** — quantos dias em média para imobiliária assinar após primeiro contato

**Arquivos de referência:**
- `~/Downloads/DRE Oliveira Imoveis Plataforma.xlsx` — DRE completo cenário R$20K
- `~/Downloads/DRE Oliveira Imoveis Plataforma 150K.xlsx` — DRE completo cenário R$150K (4 abas: mensal, anual, comparativo, premissas)
- `~/Downloads/DRE Oliveira Imoveis Plataforma Faseado.xlsx` — DRE cenário faseado R$35K (4 abas: mensal, fases, roadmap infra, premissas)

---

## 18. Análise Estratégica de Crescimento — Benchmarks de Mercado

> **Gerado em Jun/2026** com base em pesquisa de benchmarks reais de proptechs brasileiras e internacionais.

### Arquétipo da plataforma

`Data-Powered Marketplace → SaaS` — a isca de pesquisa com IA quebra o problema do "frango e ovo" gerando demanda (lojistas) independente do estoque de imóveis. Comparáveis: Loft (comissão → SaaS B2B, break-even 5 anos), Crexi/US (CRE marketplace, US$110M levantado), Kenlo/inGaia (SaaS B2B para imobiliárias, 8.500 clientes, R$95M+).

### Alerta CPL — premissa dos DREs vs. mercado real

| Premissa DREs | CPL mercado imóveis BR (Leadster 2025) | Recomendado usar |
|---|---|---|
| R$33/lead | R$50–150/lead (Meta Ads) | R$60/lead (BH otimizado) |

Alavancas para atingir R$40-50: vídeo natural/celular (-40%), rotação semanal de criativos (-35-55%), segmentação ultra-específica por segmento (-20%). Impacto: R$15K em ads gera 250 leads/mês (não 455).

### Os 3 Gates de Velocidade de Escape

| Gate | Período | Condição de aprovação |
|---|---|---|
| Gate 1 — Validação unit economics | Meses 3-6 | CPL real < R$80 + 3+ deals fechados + 2-3 imobiliárias parceiras ativas |
| Gate 2 — Frango+ovo resolvido | Meses 12-18 | 5-8 imobiliárias SaaS pagantes + MRR SaaS > custo mínimo + B2B word-of-mouth aparece |
| Gate 3 — Efeito de rede ativo | Meses 24-36 | 20-30 imobiliárias + leads orgânicos >20% + NPS >40 + expansão regional viável |

### Probabilidades de sucesso (ajustadas pelos diferenciais do projeto)

| Evento | Probabilidade | Fatores |
|---|---|---|
| Sobreviver cold start | 85% | Capital + piloto empresa-mãe |
| Atingir Gate 1 (PMF inicial) | 55% | Isca IA quebra chicken-and-egg |
| Atingir Gate 2 (SaaS funciona) | 30% | Frango+ovo resolvido em 18 meses |
| Atingir Gate 3 (efeito rede) | 15% | 30 imob, mercado defensável |
| Expansão regional | 6% | FCL positivo ou seed externo |
| Plataforma dominante BR | 2% | Cenário unicórnio |

**Referência de mercado:** 49% de startups BR já fecharam (Abstartups 2024); 20-30% de marketplaces atingem PMF; 10-15% escalam além do mercado inicial.

### Matriz de capital ótimo (IRR vs. NPV)

| Capital | P(Gate1) | P(Gate2) | P(Gate3) | IRR | NPV 5 anos | Tese |
|---|---|---|---|---|---|---|
| R$20-35K | 25% | 8% | 2% | 25% | R$280K | Não chega ao Gate 2 |
| R$60-80K | 45% | 20% | 7% | 38% | R$680K | Chega Gate 2 com dificuldade |
| **R$100-120K** | **55%** | **28%** | **11%** | **42%** | **R$980K** | **IRR ótimo — sweet spot** |
| R$150-200K | 60% | 35% | 15% | 35% | R$1,35M | NPV maior, IRR menor |
| R$300-500K+ | 65% | 45% | 22% | 28% | R$2,8M | Faz sentido se incluir SP |

**Conclusão: capital ótimo = R$100.000–120.000**, desembolsado em tranches vinculadas aos gates (não tudo de vez).

### Calendário de desembolso por gate

| Data | Tranche | Condição |
|---|---|---|
| Jul/26 | R$15K | Fase 0 — incondicionalmente (infra + validação inicial) |
| Set/26 | R$20K | Gate 1: CPL real < R$80 E 1+ deal fechado |
| Dez/26 | R$35K | 3+ deals E 1+ imobiliária interessada em SaaS |
| Mar/27 | R$25K | Gate 2: MRR SaaS > R$3.000 (3 imobiliárias pagando) |
| Buffer | R$15K | Segurar até Gate 4: break-even mensal atingido |

### Cenários de escala e valuation

| Cenário | Imobiliárias | MRR | ARR | Valuation (5x ARR) | Capital |
|---|---|---|---|---|---|
| A — BH Dominante (Ano 3-4) | 30 BH | R$35K | R$420K | R$2,1M | R$80-120K |
| B — Expansão Sul/Sudeste (Ano 5) | 100-120 | R$100-150K | R$1,2-1,8M | R$7-11M | R$300-500K (seed) |
| C — Nacional (Ano 7-8) | 300-500 | R$450-750K | R$5-9M | R$40-72M | R$2-5M (Series A) |
| D — Unicórnio (Ano 10+) | 2.000+ | >R$2M | — | >R$500M | R$20-50M (VC) |

### Estratégia de expansão sem VC

1. Dominar BH com R$100-120K → plateau de R$35-40K MRR
2. Usar FCL de BH para financiar Goiânia, Curitiba, POA (sem diluição)
3. Entrar em SP apenas com capital externo (seed/angel) quando valuation BH = R$2-3M
4. Valuation de entrada em SP justifica angel R$500K com 15-20% de equity

### Kill-shots identificados (riscos críticos)

1. **CPL real > R$100** sem otimização de criativos → runway queima antes do Gate 1
2. **Imobiliárias não assinam SaaS** sem volume provado → Gate 2 não acontece
3. **Ciclo de venda longo** (45-90 dias) → capital acaba antes do primeiro deal
4. **Concorrente OLX/ZAP** lança produto similar → diferencial IA fica comoditizado

---

## 19. Decisão Estratégica — Sinergia Imobiliária × Plataforma (conflito de canal)

> **Gerado em Jun/2026.** Pergunta analisada: vale a pena a Oliveira Imobiliária crescer fechando os leads gerados pela plataforma (sinergia), ou delegar tudo a parceiras e focar só na plataforma? Baseado em modelagem financeira + benchmarks de mercado (Zillow, Amazon, Booking/Airbnb, Compass/Opendoor/REX, CoStar).

### Conclusão: HÍBRIDO FASEADO (nem sinergia total, nem delegação pura)

A sinergia total é uma **armadilha de conflito de canal** que destrói o SaaS. A imobiliária deve ser o **closer âncora no piloto** e depois ocupar uma **faixa não-competitiva** quando o SaaS escalar. Foco principal = desenvolvimento da plataforma (onde está o múltiplo de valuation alto e a escala).

### Modelagem dos 3 cenários (plateau anual)

| Cenário | Captura ecossistema/ano | SaaS sobrevive? | Valida Gate 1? | Múltiplo valuation |
|---|---|---|---|---|
| Sinergia Total (imob fecha tudo) | R$36K | ❌ Mata –R$360K ARR | ✅ | 1-2x (vira corretora) |
| Delegação Pura (imob = só +1 parceira) | R$414K | ✅ | ❌ sem closer próprio | 5-10x |
| **Híbrido Faseado ✓** | **R$612K** | ✅ | ✅ | 5-10x |

**Por que a sinergia total falha:**
- **Gargalo:** plataforma gera ~6 deals/mês, imobiliária absorve só 2 (capacidade Brenda+assistente) → 67% do funil desperdiçado = R$35K/mês de LTV jogado fora
- **Mata o SaaS:** nenhuma das 29 outras imobiliárias paga R$1.000/mês para competir com a dona da plataforma → –R$360K/ano de ARR
- LTV de 1 imóvel captado pela imob: R$8.750 (R$1.250 captação + R$250/mês × 30 meses)

### Benchmarks que confirmam (precedentes reais)

| Caso | Lição |
|---|---|
| **Zillow Offers** | Vendia leads a corretores → virou corretora direta → 84-87% dos agentes desconfiaram → prejuízo US$500M+ → recuou para neutralidade (2021). **Espelho exato deste caso.** |
| **Amazon 1P/3P** | Sellers só aturam o conflito por falta de alternativa (lock-in). Imobiliárias de BH TÊM alternativa (OLX/ZAP/captação própria) → risco de saída muito maior |
| **Booking/Expedia/Airbnb** | Neutralidade asset-light = margens 36-40% e valuations altos. Não são donos do estoque |
| **Compass/Opendoor/REX** | Duplo papel (plataforma + corretora) quase sem precedente de sucesso em escala. REX fechou em 2022 |
| **Valuation** | SaaS B2B puro: 3-7x+ receita. Corretora: <1x receita. Integração vertical derruba o múltiplo do conjunto em até 5x |

### Como estruturar o híbrido faseado

**Fase Piloto (2026-2027):** imobiliária é o closer âncora — obrigatório para validar Gate 1 (provar que lead vira contrato). Pega leads de BH nos segmentos/regiões onde tem inventário.

**Fase Escala (2028+):** a separação das empresas (Jan/2028) é o que resolve o conflito. Estruturar:
1. Imobiliária ocupa **faixa definida não-competitiva** (ex: Centro-Sul + segmentos premium) OU só absorve overflow
2. **Regra de muralha/transparência:** lead vai para imobiliária com melhor match real, não automaticamente "para a casa"
3. Plataforma **se posiciona publicamente como neutra** → preserva o múltiplo SaaS e a confiança das 29 parceiras

### Princípio-guia

> A imobiliária cresce mais sendo **uma cliente exemplar** do ecossistema do que sendo **a predadora** dele. Foco principal = plataforma (múltiplo 5-10x, escala nacional). Imobiliária = instrumento de piloto + faixa controlada, nunca a fechadora prioritária dos leads.

**Arquivos gerados nesta análise:**
- `~/Downloads/DRE Oliveira Imoveis Plataforma Faseado.xlsx` — DRE faseado com gates e roadmap de infraestrutura

---

## 20. Plano de Evolução Pipeline → Plataforma (Platform Revolution)

> **Gerado em 26/07/2026** a partir do livro *Platform Revolution* (Parker, Van Alstyne & Choudary). Documento completo: `Documents/Rede Oliveira Imóveis/03 - Plano de Negócio e Estratégia/Plano-Evolucao-Plataforma-Platform-Revolution.md`

### Diagnóstico
O MVP hoje é um **pipeline** (serviço de geração de leads com IA), não uma plataforma. Ordem de construção definida: **dados primeiro → portal da imobiliária depois → automação do matching por último.**

### Roadmap (alinhado aos Gates da seção 18)
- **Fase 1 (agora → Gate 1):** estruturar o dado — banco operacional, métricas de plataforma no CRM (✅ feito), pesquisa em PDF compartilhável com marca, registrar todo match e motivo de perda
- **Fase 2 (pós-Gate 1 → Gate 2):** portal da imobiliária — cadastro self-service de imóveis, recebimento de leads com pesquisa anexada, **status obrigatório por lead** (governança por incentivo: quem não reporta perde prioridade)
- **Fase 3 (pós-Gate 2, 2028+):** matching semi-automático treinado no histórico, score de qualidade das imobiliárias, neutralidade pública

### Métricas de plataforma no CRM Notion (implementadas 26/07, revisadas 26/07/2026 com o funil real)

**Funil real da operação (jul/2026):** lead da campanha → 1º contato (pergunta o segmento) → call de pesquisa → entrega da pesquisa ~1 semana depois → pós-entrega → match de imóvel → fechamento. O 1º cliente **sumiu após receber a pesquisa gratuita** — ghosting pós-entrega é o problema nº 1 a monitorar.

**Datas no CRM (uma por etapa):** `Data 1º Contato` → `Data Call` → `Data Entrega Pesquisa` → `Data Match` → `Data Fechamento`. Fórmulas automáticas: `Dias até 1º Contato`, `Dias Call até Entrega`, `Dias até Match`, `Dias até Fechamento`. Campos de acompanhamento: `Pós-Entrega` (Aguardando / Respondeu / Sumiu), `Retorno da Imobiliária`, `Motivo da Perda` (inclui "Sumiu após receber pesquisa" e "Fechou por fora (leakage)"), `Pagou Pesquisa` + `Valor Pesquisa (R$)`.

| Métrica | Pergunta | Cálculo | Meta |
|---|---|---|---|
| Velocidade 1º contato | Falamos com o lead ainda quente? | média Dias até 1º Contato | < 1 dia |
| Taxa de call | O lead tem interesse real? | Data Call ÷ Data 1º Contato | > 50% |
| Prazo da pesquisa | Cumprimos a promessa de 1 semana? | média Dias Call até Entrega | ≤ 7 dias |
| **Retorno pós-entrega** | Cliente continua após receber a pesquisa? | "Respondeu" ÷ entregas | > 60% |
| Taxa de match | Temos imóvel para oferecer? | Data Match ÷ entregas | > 40% |
| Taxa de fechamento | Lead vira contrato? | Fechados ÷ entregas | 2–2,5% dos leads |
| Time-to-close | Tempo até a comissão | média Dias até Fechamento | 45–60 dias |
| Leakage | Fechando por fora? | "Fechou por fora" ÷ entregues à imob. | < 5% |
| Engajamento da oferta | Imobiliárias respondem? | Retorno ≠ "Sem retorno" | > 80% |

**Pesquisa paga — modelo definido (26/07/2026): R$697 com consultoria individual**, devolvidos integralmente como crédito no 1º aluguel/honorários se o cliente fechar locação intermediada pela Oliveira em até 6 meses (commitment device; filtra curiosos sem matar demanda — juridicamente é desconto condicionado, NÃO venda casada, desde que a pesquisa seja vendida sozinha, entregue sempre, e o cliente possa usá-la com terceiros). Decisão 26/07: as cláusulas NÃO vão nos Termos de Uso — viraram **contrato de prestação de serviços enviado por e-mail** ao cliente que quiser a pesquisa (modelo: `03 - Plano de Negócio e Estratégia/Contrato-Pesquisa-Mercado-Consultoria-697.md` + versão Word `Contrato-Pesquisa-Mercado-Oliveira.docx`). **Status 27/07/2026: parecer do advogado Gabriel Vilas Boas (OAB/MG 239.986) recebido e ajustes confirmados por e-mail — aguardando minuta final. Não usar com clientes antes da minuta final.**

Ajustes confirmados (mudam o fluxo operacional):
- **Não é venda casada** (confirmado). Cuidados: nunca exigir a pesquisa p/ alugar; publicidade jamais diz "grátis" (CDC art. 30); arquivar exemplos de pesquisas vendidas a quem não alugou.
- **Assinatura eletrônica padrão (ZapSign via WhatsApp)**; pagamento-como-aceite vira rede de segurança. Sem assinatura: PDF antes do link de pagamento + "li e concordo" + arquivar.
- **⚠️ Call de consultoria só a partir do 8º dia após o pagamento** (esgota os 7 dias de arrependimento do CDC antes da execução; antecipação só com pedido expresso registrado; relatório sempre após o 7º dia). Fluxo: interesse → contrato → pagamento = aceite → briefing escrito → (8º dia) call → relatório em até 7 dias úteis.
- **Briefing escrito preenchido na contratação** (substitui "2 faltas = execução iniciada"): faltou 2× sem remarcar 24h antes → pesquisa entregue com base no briefing.
- **Formatação**: fonte ≥12 + negrito/caixa alta nas Cláusulas 6ª, 7ª e 8ª (CDC art. 54).
- **Cláusula 5.4 (27/07)**: crédito só em locação intermediada pela Oliveira — imóvel sob gestão/exclusividade de outra imobiliária = sem crédito/reembolso.

Registrar em `Pagou Pesquisa`/`Valor Pesquisa (R$)` e comparar ghosting de pagantes vs. gratuitos.

**Regras:** `Motivo da Perda` nunca fica vazio quando Fase = Perdido. Se "Sem imóvel compatível" dominar → gargalo é estoque (captar imobiliárias). Entregar pesquisa sempre com próximo passo concreto (imóvel indicado ou prazo prometido) — pesquisa sem próximo passo = ghosting. Guia de preenchimento: página "📊 Métricas de Plataforma" dentro de 🏠 MVP Oliveira no Notion.
