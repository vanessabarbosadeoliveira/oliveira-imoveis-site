import base64, pathlib

BASE = pathlib.Path(__file__).parent
TEMPLATE = (BASE / "template.html").read_text(encoding="utf-8")
OUT_DIR = BASE.parent / "build"
OUT_DIR.mkdir(exist_ok=True)

def b64(name):
    return base64.b64encode((BASE / name).read_bytes()).decode("ascii")

ANTES_B64 = b64("antes.jpg")

PAGES = [
    dict(
        slug="quiropraxia",
        out="oportunidade-quiropraxia.html",
        title="Loja comercial para Clínica de Quiropraxia — Av. Getúlio Vargas, 306 | Oliveira Imóveis",
        meta_desc="Nossa pesquisa de mercado identificou potencial para uma Clínica de Quiropraxia neste endereço. Conheça o espaço e agende sua visita com a Oliveira Imóveis.",
        hero_desc='Nossa <strong>pesquisa de mercado</strong> identificou potencial para uma <strong>Clínica de Quiropraxia</strong> neste espaço, em uma das avenidas mais valorizadas da cidade — pronto para receber a próxima história de sucesso.',
        transform_title="na experiência da sua clínica de quiropraxia.",
        depois_img="depois-quiropraxia.jpg",
        depois_alt="Clínica de Quiropraxia implantada no mesmo espaço",
        pagina_origem="oportunidade-quiropraxia (www.oliveiraimoveis.ia.br)",
        content_name="oportunidade-quiropraxia",
        segmento="quiropraxia",
    ),
    dict(
        slug="tricologia",
        out="oportunidade-tricologia.html",
        title="Loja comercial para Clínica de Tricologia — Av. Getúlio Vargas, 306 | Oliveira Imóveis",
        meta_desc="Nossa pesquisa de mercado identificou potencial para uma Clínica de Tricologia neste endereço. Conheça o espaço e agende sua visita com a Oliveira Imóveis.",
        hero_desc='Nossa <strong>pesquisa de mercado</strong> identificou potencial para uma <strong>Clínica de Tricologia</strong> neste espaço, em uma das avenidas mais valorizadas da cidade — pronto para receber a próxima história de sucesso.',
        transform_title="na experiência da sua clínica de tricologia.",
        depois_img="depois-tricologia.jpg",
        depois_alt="Clínica de Tricologia implantada no mesmo espaço",
        pagina_origem="oportunidade-tricologia (www.oliveiraimoveis.ia.br)",
        content_name="oportunidade-tricologia",
        segmento="tricologia",
    ),
    dict(
        slug="recovery",
        out="oportunidade-recovery.html",
        title="Loja comercial para Estúdio de Recovery — Av. Getúlio Vargas, 306 | Oliveira Imóveis",
        meta_desc="Nossa pesquisa de mercado identificou potencial para um Estúdio de Recovery (crioterapia e pressoterapia) neste endereço. Conheça o espaço e agende sua visita com a Oliveira Imóveis.",
        hero_desc='Nossa <strong>pesquisa de mercado</strong> identificou potencial para um <strong>Estúdio de Recovery</strong> — crioterapia e pressoterapia — neste espaço, em uma das avenidas mais valorizadas da cidade, pronto para receber a próxima história de sucesso.',
        transform_title="na experiência do seu estúdio de recovery.",
        depois_img="depois-recovery.jpg",
        depois_alt="Estúdio de Recovery implantado no mesmo espaço",
        pagina_origem="oportunidade-recovery (www.oliveiraimoveis.ia.br)",
        content_name="oportunidade-recovery",
        segmento="estudio_recovery",
    ),
]

for p in PAGES:
    html = TEMPLATE
    html = html.replace("{{TITLE}}", p["title"])
    html = html.replace("{{META_DESC}}", p["meta_desc"])
    html = html.replace("{{HERO_DESC}}", p["hero_desc"])
    html = html.replace("{{TRANSFORM_TITLE}}", p["transform_title"])
    html = html.replace("{{DEPOIS_ALT}}", p["depois_alt"])
    html = html.replace("{{PAGINA_ORIGEM}}", p["pagina_origem"])
    html = html.replace("{{PAGE_SLUG}}", p["slug"])
    html = html.replace("{{CONTENT_NAME}}", p["content_name"])
    html = html.replace("{{SEGMENTO}}", p["segmento"])
    html = html.replace("{{ANTES_B64}}", ANTES_B64)
    html = html.replace("{{DEPOIS_B64}}", b64(p["depois_img"]))

    out_path = OUT_DIR / p["out"]
    out_path.write_text(html, encoding="utf-8")
    size_kb = out_path.stat().st_size / 1024
    print(f"{p['out']}: {size_kb:.0f} KB")
