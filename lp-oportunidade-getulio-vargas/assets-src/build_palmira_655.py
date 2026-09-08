import re, base64, pathlib

BASE = pathlib.Path(__file__).parent
SRC_FILE = BASE.parent.parent / "lp-oportunidade-clinica" / "build" / "oportunidade-clinica-savassi.html"
OUT_DIR = BASE.parent / "build"
OUT_DIR.mkdir(exist_ok=True)

html_src = SRC_FILE.read_text(encoding="utf-8")


def b64_of(name):
    return base64.b64encode((BASE / name).read_bytes()).decode("ascii")


ANTES_B64 = b64_of("antes-palmira.jpg")
DEPOIS_B64 = b64_of("depois-palmira.jpg")

img_pattern = re.compile(r'<img\s+src="data:([^;"]+);base64,([^"]+)"([^>]*)>')
matches = list(img_pattern.finditer(html_src))
assert len(matches) == 5, f"esperava 5 <img> com data-uri, achei {len(matches)}"
hero_bg_m, header_logo_m, before_m, after_m, footer_logo_m = matches


def replace_img(html, m, new_mime, new_b64, new_attrs=None):
    old_tag = m.group(0)
    attrs = new_attrs if new_attrs is not None else m.group(3)
    new_tag = f'<img src="data:{new_mime};base64,{new_b64}"{attrs}>'
    assert html.count(old_tag) == 1, "tag de imagem não é única — abortando pra não trocar a errada"
    return html.replace(old_tag, new_tag, 1)


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

ICON_PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>'
ICON_PEOPLE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3v18h18"/><path d="m7 14 3.5-3.5 3 3L19 7"/><path d="M19 7h-3.6M19 7v3.6"/></svg>'

NEW_OPP_CARD = f'''  <aside class="opportunity-card" aria-label="Diferenciais da oportunidade">
    <div class="opp-item">
      {ICON_PIN}
      <div><strong>Centro Comercial Iracema — Rua Palmira, 655</strong><span>96 m² + mezanino no bairro Serra</span></div>
    </div>
    <div class="opp-item">
      {ICON_PEOPLE}
      <div><strong>Estacionamento frontal</strong><span>Facilidade de acesso para pacientes e equipe</span></div>
    </div>
    <div class="opp-item">
      {ICON_CHECK}
      <div><strong>2 banheiros — espaço configurável</strong><span>Pronto para recepção, avaliação e atendimento</span></div>
    </div>
  </aside>'''

html = html_src

html = replace_img(html, hero_bg_m, "image/jpeg", DEPOIS_B64,
                    new_attrs=' alt="Clínica de saúde e estética implantada no espaço da Rua Palmira, ambiente pronto para atender." width="900" height="1125" loading="eager" fetchpriority="high" decoding="async"')
html = replace_img(html, before_m, "image/jpeg", ANTES_B64,
                    new_attrs=' alt="Espaço comercial vazio na Rua Palmira, 655, antes da transformação." loading="lazy"')
html = replace_img(html, after_m, "image/jpeg", DEPOIS_B64,
                    new_attrs=' alt="Clínica de saúde e estética implantada no espaço da Rua Palmira, ambiente pronto para atender." loading="lazy"')

html = html.replace(TITLE_ANCHOR, '<title>Loja Comercial na Rua Palmira, 655 — Centro Comercial Iracema | Oliveira Imóveis</title>')
html = html.replace(META_ANCHOR, '<meta name="description" content="Nossa pesquisa de mercado identificou potencial para clínicas de saúde e estética neste espaço de 96 m² + mezanino no Centro Comercial Iracema, Rua Palmira, bairro Serra. Conheça o espaço e agende sua visita com a Oliveira Imóveis." />')
html = html.replace(PAGINA_ORIGEM_ANCHOR, "var PAGINA_ORIGEM = 'oportunidade-palmira-655 (www.oliveiraimoveis.ia.br)';\n  var CONTENT_NAME = 'oportunidade-palmira-655';")
html = html.replace(PAGE_ANCHOR, "var PAGE = 'oportunidade-palmira-655';")
html = html.replace(CONTENT_NAME_LEAD_ANCHOR, "fbq('track', 'Lead', {content_name: CONTENT_NAME, value: 1, currency: 'BRL'}, {eventID: LEAD_EVENT_ID});")
html = html.replace("segmento: 'sem_segmento',", "segmento: 'palmira-655',")

HERO_TITLE = '''    <h1 class="hero__title">
      <span>Este espaço pode ser</span>
      <span>o <strong class="hl">próximo passo</strong></span>
      <span>da sua clínica.</span>
    </h1>'''
html = html.replace(HERO_TITLE_ANCHOR, HERO_TITLE)

HERO_TEXT = '''    <p class="hero__text">
      <strong>Nossa <span class="research-accent">análise de mercado</span> identificou:</strong> clínicas e operações voltadas à saúde, estética e cuidados especializados estão entre os negócios com maior aderência a este espaço no Centro Comercial Iracema, na Rua Palmira, pela localização, configuração do imóvel e perfil do entorno.
    </p>'''
html = html.replace(HERO_TEXT_ANCHOR, HERO_TEXT)

html = html.replace(OPP_CARD_ANCHOR, NEW_OPP_CARD)
html = html.replace(TRANSFORM_TITLE_ANCHOR, "na experiência da sua clínica.")

out_path = OUT_DIR / "oportunidade-palmira-655.html"
out_path.write_text(html, encoding="utf-8")
print("oportunidade-palmira-655.html", f"{out_path.stat().st_size/1024:.0f} KB")
