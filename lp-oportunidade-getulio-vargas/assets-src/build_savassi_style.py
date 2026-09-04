import re, base64, pathlib

BASE = pathlib.Path(__file__).parent
SRC_FILE = BASE.parent.parent / "lp-oportunidade-clinica" / "build" / "oportunidade-clinica-savassi.html"
OUT_DIR = BASE.parent / "build"
OUT_DIR.mkdir(exist_ok=True)

html_src = SRC_FILE.read_text(encoding="utf-8")

def b64_of(name):
    return base64.b64encode((BASE / name).read_bytes()).decode("ascii")

ANTES_B64 = b64_of("antes.jpg")  # 1600x2133

# ---- Locate the 5 <img data-uri> tags in document order and identify them ----
img_pattern = re.compile(r'<img\s+src="data:([^;"]+);base64,([^"]+)"([^>]*)>')
matches = list(img_pattern.finditer(html_src))
assert len(matches) == 5, f"esperava 5 <img> com data-uri, achei {len(matches)}"
# order: 0 hero-bg, 1 header-logo, 2 before, 3 after, 4 footer-logo
hero_bg_m, header_logo_m, before_m, after_m, footer_logo_m = matches

def replace_img(html, m, new_mime, new_b64, new_attrs=None):
    old_tag = m.group(0)
    attrs = new_attrs if new_attrs is not None else m.group(3)
    new_tag = f'<img src="data:{new_mime};base64,{new_b64}"{attrs}>'
    assert html.count(old_tag) == 1, "tag de imagem não é única — abortando pra não trocar a errada"
    return html.replace(old_tag, new_tag, 1)

# Common anchors (verbatim substrings from the savassi source) shared by all variants
TITLE_ANCHOR = '<title>Sala Comercial na Savassi — R$ 1.300/mês | Oliveira Imóveis</title>'
META_ANCHOR = '<meta name="description" content="Sala comercial de 38 m² no Edifício Modesto Starling, Savassi, por R$ 1.300 mensais: banheiro privativo, ar-condicionado e elevador. Ideal para consultório ou escritório." />'
PAGINA_ORIGEM_ANCHOR = "var PAGINA_ORIGEM = 'oportunidade-clinica-savassi (www.oliveiraimoveis.ia.br)';"
PAGE_ANCHOR = "var PAGE = 'oportunidade-clinica-savassi';"
CONTENT_NAME_LEAD_ANCHOR = "fbq('track', 'Lead', {content_name: 'oportunidade-clinica', value: 1, currency: 'BRL'}, {eventID: LEAD_EVENT_ID});"
HERO_TITLE_ANCHOR = '''    <h1 class="hero__title">
      <span>Este espaço pode ser</span>
      <span>o <strong class="hl">próximo passo</strong></span>
      <span>do seu consultório.</span>
    </h1>'''
HERO_TEXT_ANCHOR = '''    <p class="hero__text">
      <strong>Nossa <span class="research-accent">análise de mercado</span> identificou:</strong> consultórios, escritórios e atendimento profissional têm a maior aderência a esta sala de 38 m² no Edifício Modesto Starling, na Savassi.
    </p>'''
OPP_CARD_ANCHOR = '''  <aside class="opportunity-card" aria-label="Diferenciais da oportunidade">
    <div class="opp-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
      <div><strong>Edifício Modesto Starling — Savassi</strong><span>38 m² na região mais estratégica de BH</span></div>
    </div>
    <div class="opp-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      <div><strong>R$ 1.300 mensais</strong><span>Uma conta que fecha para consultório ou escritório</span></div>
    </div>
    <div class="opp-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3v18h18"/><path d="m7 14 3.5-3.5 3 3L19 7"/><path d="M19 7h-3.6M19 7v3.6"/></svg>
      <div><strong>Banheiro privativo, ar-condicionado e elevador</strong><span>Pronto para a rotina profissional</span></div>
    </div>
  </aside>'''
TRANSFORM_TITLE_ANCHOR = 'na experiência do seu consultório.'
BEFORE_ALT_ANCHOR = 'Espaço comercial vazio, antes da transformação.'
AFTER_ALT_ANCHOR = 'Recepção de clínica finalizada, ambiente acolhedor e moderno.'

for anchor in [TITLE_ANCHOR, META_ANCHOR, PAGINA_ORIGEM_ANCHOR, PAGE_ANCHOR, CONTENT_NAME_LEAD_ANCHOR,
               HERO_TITLE_ANCHOR, HERO_TEXT_ANCHOR, OPP_CARD_ANCHOR, TRANSFORM_TITLE_ANCHOR,
               BEFORE_ALT_ANCHOR, AFTER_ALT_ANCHOR]:
    assert html_src.count(anchor) == 1, f"anchor não encontrado (ou duplicado): {anchor[:60]!r}"

OPP_ITEM_ICONS = [
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3v18h18"/><path d="m7 14 3.5-3.5 3 3L19 7"/><path d="M19 7h-3.6M19 7v3.6"/></svg>',
]

def opp_card(items):
    parts = ['  <aside class="opportunity-card" aria-label="Diferenciais da oportunidade">']
    for icon, (strong, span) in zip(OPP_ITEM_ICONS, items):
        parts.append(f'    <div class="opp-item">\n      {icon}\n      <div><strong>{strong}</strong><span>{span}</span></div>\n    </div>')
    parts.append('  </aside>')
    return '\n'.join(parts)

GENERIC_OPP_ITEMS = [
    ("Av. Getúlio Vargas, 306", "Endereço estratégico, conectado à dinâmica comercial da região"),
    ("Visibilidade para o seu negócio", "Um imóvel que coloca sua marca no movimento do entorno"),
    ("Acesso conveniente", "Fácil chegada para clientes, profissionais e fornecedores"),
]

PAGES = [
    dict(
        slug="farmacia",
        out="oportunidade-farmacia.html",
        title="Loja comercial para Farmácia de Manipulação — Av. Getúlio Vargas, 306 | Oliveira Imóveis",
        meta_desc="Nossa pesquisa de mercado identificou potencial para uma Farmácia de Manipulação neste endereço. Conheça o espaço e agende sua visita com a Oliveira Imóveis.",
        hero_title_tail="da sua farmácia de manipulação.",
        hero_text='<strong>Nossa <span class="research-accent">pesquisa de mercado</span> identificou:</strong> farmácia de manipulação é o negócio com maior potencial neste espaço da Av. Getúlio Vargas, uma das avenidas mais valorizadas da cidade.',
        transform_title="na experiência da sua farmácia.",
        depois_img="depois-farmacia.jpg",
        depois_alt="Farmácia de Manipulação implantada no mesmo espaço, pronta para atender.",
        content_name="oportunidade-farmacia",
    ),
    dict(
        slug="quiropraxia",
        out="oportunidade-quiropraxia.html",
        title="Loja comercial para Clínica de Quiropraxia — Av. Getúlio Vargas, 306 | Oliveira Imóveis",
        meta_desc="Nossa pesquisa de mercado identificou potencial para uma Clínica de Quiropraxia neste endereço. Conheça o espaço e agende sua visita com a Oliveira Imóveis.",
        hero_title_tail="da sua clínica de quiropraxia.",
        hero_text='<strong>Nossa <span class="research-accent">pesquisa de mercado</span> identificou:</strong> clínica de quiropraxia é o negócio com maior potencial neste espaço da Av. Getúlio Vargas, uma das avenidas mais valorizadas da cidade.',
        transform_title="na experiência da sua clínica de quiropraxia.",
        depois_img="depois-quiropraxia.jpg",
        depois_alt="Clínica de Quiropraxia implantada no mesmo espaço, ambiente pronto para atender.",
        content_name="oportunidade-quiropraxia",
    ),
    dict(
        slug="tricologia",
        out="oportunidade-tricologia.html",
        title="Loja comercial para Clínica de Tricologia — Av. Getúlio Vargas, 306 | Oliveira Imóveis",
        meta_desc="Nossa pesquisa de mercado identificou potencial para uma Clínica de Tricologia neste endereço. Conheça o espaço e agende sua visita com a Oliveira Imóveis.",
        hero_title_tail="da sua clínica de tricologia.",
        hero_text='<strong>Nossa <span class="research-accent">pesquisa de mercado</span> identificou:</strong> clínica de tricologia é o negócio com maior potencial neste espaço da Av. Getúlio Vargas, uma das avenidas mais valorizadas da cidade.',
        transform_title="na experiência da sua clínica de tricologia.",
        depois_img="depois-tricologia.jpg",
        depois_alt="Clínica de Tricologia implantada no mesmo espaço, ambiente pronto para atender.",
        content_name="oportunidade-tricologia",
    ),
    dict(
        slug="recovery",
        out="oportunidade-recovery.html",
        title="Loja comercial para Estúdio de Recovery — Av. Getúlio Vargas, 306 | Oliveira Imóveis",
        meta_desc="Nossa pesquisa de mercado identificou potencial para um Estúdio de Recovery (crioterapia e pressoterapia) neste endereço. Conheça o espaço e agende sua visita com a Oliveira Imóveis.",
        hero_title_tail="do seu estúdio de recovery.",
        hero_text='<strong>Nossa <span class="research-accent">pesquisa de mercado</span> identificou:</strong> estúdio de recovery — crioterapia e pressoterapia — é o negócio com maior potencial neste espaço da Av. Getúlio Vargas, uma das avenidas mais valorizadas da cidade.',
        transform_title="na experiência do seu estúdio de recovery.",
        depois_img="depois-recovery.jpg",
        depois_alt="Estúdio de Recovery implantado no mesmo espaço, ambiente pronto para atender.",
        content_name="oportunidade-recovery",
    ),
]

for p in PAGES:
    html = html_src

    # hero bg -> foto "depois" (transformação) de cada negócio, não a loja vazia.
    # before/after (seção "transforme este espaço") continuam antes=vazio / depois=negócio.
    depois_b64 = b64_of(p["depois_img"])
    html = replace_img(html, hero_bg_m, "image/jpeg", depois_b64,
                        new_attrs=f' alt="{p["depois_alt"]}" width="900" height="1125" loading="eager" fetchpriority="high" decoding="async"')
    html = replace_img(html, before_m, "image/jpeg", ANTES_B64,
                        new_attrs=' alt="Espaço comercial vazio, antes da transformação." loading="lazy"')
    html = replace_img(html, after_m, "image/jpeg", depois_b64,
                        new_attrs=f' alt="{p["depois_alt"]}" loading="lazy"')
    # logos (header + footer) stay untouched — real Oliveira Imóveis brand assets

    html = html.replace(TITLE_ANCHOR, f'<title>{p["title"]}</title>')
    html = html.replace(META_ANCHOR, f'<meta name="description" content="{p["meta_desc"]}" />')
    html = html.replace(PAGINA_ORIGEM_ANCHOR, f"var PAGINA_ORIGEM = 'oportunidade-{p['slug']} (www.oliveiraimoveis.ia.br)';\n  var CONTENT_NAME = '{p['content_name']}';")
    html = html.replace(PAGE_ANCHOR, f"var PAGE = 'oportunidade-{p['slug']}';")
    html = html.replace(CONTENT_NAME_LEAD_ANCHOR, "fbq('track', 'Lead', {content_name: CONTENT_NAME, value: 1, currency: 'BRL'}, {eventID: LEAD_EVENT_ID});")
    html = html.replace("segmento: 'sem_segmento',", f"segmento: '{p['slug']}',")

    hero_title = f'''    <h1 class="hero__title">
      <span>Este espaço pode ser</span>
      <span>o <strong class="hl">próximo passo</strong></span>
      <span>{p["hero_title_tail"]}</span>
    </h1>'''
    html = html.replace(HERO_TITLE_ANCHOR, hero_title)

    hero_text = f'''    <p class="hero__text">
      {p["hero_text"]}
    </p>'''
    html = html.replace(HERO_TEXT_ANCHOR, hero_text)

    html = html.replace(OPP_CARD_ANCHOR, opp_card(GENERIC_OPP_ITEMS))
    html = html.replace(TRANSFORM_TITLE_ANCHOR, p["transform_title"])

    out_path = OUT_DIR / p["out"]
    out_path.write_text(html, encoding="utf-8")
    print(p["out"], f"{out_path.stat().st_size/1024:.0f} KB")
