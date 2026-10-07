#!/usr/bin/env python3
"""Gera a LP do Instagram orgânico a partir da LP Palmira 655 v2 (mesmo formulário,
rastreio e design), trocando textos/provas pelos do site oliveiraimoveis.ia.br.
Origem do lead FIXA: Instagram orgânico (independe dos parâmetros da URL).
Uso: python3 lp-instagram-organico/assets-src/build_instagram.py
"""
import re, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = ROOT / 'lp-oportunidade-getulio-vargas/build/oportunidade-palmira-655-v2.html'
OUT = ROOT / 'lp-instagram-organico/build/instagram.html'
s = SRC.read_text(encoding='utf-8')

def sub(old, new, count=1):
    global s
    assert s.count(old) >= 1, 'não achei: ' + old[:70]
    s = s.replace(old, new, count)

def sub_re(pat, new, flags=re.S):
    global s
    s, n = re.subn(pat, lambda m: new, s, count=1, flags=flags)
    assert n == 1, 'regex não achou: ' + pat[:70]

# --- head ---
sub_re(r'<title>.*?</title>', '<title>Oliveira Imóveis — imóveis comerciais em Belo Horizonte</title>')
sub_re(r'<meta name="description" content="[^"]*" />', '<meta name="description" content="Procurando imóvel comercial em Belo Horizonte ou com imóvel comercial parado? A Oliveira Imóveis ajuda com estratégia, curadoria de negócios e marketing digital." />')
sub('<meta name="robots" content="index, follow" />', '<meta name="robots" content="noindex, follow" />')  # página de campanha, não concorre com o site

# --- hero: imagem de fundo = fachada do Iracema (2ª imagem grande; reaproveita a da seção "transform") ---
imgs = re.findall(r'<img src="(data:image/[^"]+)"[^>]*alt="Fachada do Centro Comercial Iracema', s)
assert imgs, 'fachada não encontrada'
fachada = imgs[0]
s = re.sub(r'(<div class="hero__bg"><img src=")data:image/[^"]+("[^>]*?alt=")[^"]*(")',
           lambda m: m.group(1) + fachada + m.group(2) + 'Fachada de centro comercial em Belo Horizonte.' + m.group(3), s, count=1, flags=re.S)

# --- hero: textos ---
sub_re(r'<p class="opportunity-badge">.*?</p>', '<p class="opportunity-badge"><span>Imóveis</span> <strong>comerciais em BH</strong></p>')
sub_re(r'<h1 class="hero__title">.*?</h1>', '''<h1 class="hero__title">
      <span>Procurando <strong class="hl">imóvel comercial</strong></span>
      <span>ou com o seu imóvel</span>
      <span>comercial parado?</span>
    </h1>''')
sub_re(r'<p class="hero__text">.*?</p>', '''<p class="hero__text">
      <strong>Mais do que alugar e administrar imóveis.</strong> Posicionamos espaços comerciais com <span class="research-accent">estratégia, curadoria de negócios e marketing digital</span> em Belo Horizonte. Conte quem você é e a gente continua a conversa no WhatsApp.
    </p>''')
sub_re(r'<h2 class="hero-form__title" id="hero-form-title">.*?</h2>', '<h2 class="hero-form__title" id="hero-form-title">Olá, quero falar com a<br />Oliveira Imóveis.</h2>')
sub('aria-label="Quero saber os detalhes dessa loja"><span>Quero saber os detalhes</span>', 'aria-label="Quero falar com a Oliveira Imóveis"><span>Quero falar com a Oliveira</span>')

# --- cartão de provas: REMOVIDO (Vanessa, 07/10/2026: só o formulário) ---
sub_re(r'<aside class="opportunity-card".*?</aside>', '')

# --- seções abaixo do hero (perfis/fotos do case e faixa de benefícios): REMOVIDAS, só o formulário ---
sub_re(r'<section class="transform".*?</section>', '')
sub_re(r'<section class="lead".*?</section>', '')

# --- rodapé ---
# Vanessa, 07/10/2026: logo do rodapé maior e sem a frase.
sub_re(r'<p class="footer__text">.*?</p>', '')
FOOTER_CSS = """
  /* LP Instagram: logo do rodapé maior, rodapé mais alto */
  .footer{ padding-block: clamp(28px, 4vw, 48px); flex-direction:column; align-items:center; justify-content:center; text-align:center; gap:18px; }
  .footer .brand{ display:flex; justify-content:center; }
  .footer .brand img{ width: clamp(210px, 24vw, 320px) !important; height:auto; }
  .footer__contacts{ justify-content:center; flex-wrap:wrap; }
  @media (max-width: 700px){
    .footer .brand img{ width: min(260px, 72vw) !important; }
  }
"""
# CSS no último </style> do head (vence as regras anteriores por ordem + !important)
k = s.index('</style>', s.index('/* ============ FOOTER'))
s = s[:k] + FOOTER_CSS + s[k:]

# --- remove IIFE que usa o hero (background do painel) — mantido, pois .hero__bg img continua existindo ---

# --- textos legais (genéricos, sem "visita ao imóvel") ---
s = s.replace('formulário de agendamento de visita', 'formulário de contato')
s = s.replace('agendar a sua visita ao imóvel', 'continuar a conversa sobre o seu imóvel ou a sua busca por um ponto comercial')
s = s.replace('oportunidade comercial apresentadas nesta página', 'serviços apresentadas nesta página')

# --- origem FIXA: Instagram orgânico + sem imóvel ---
sub("var PAGINA_ORIGEM = 'oportunidade-palmira-655-v2 (www.oliveiraimoveis.ia.br)';", "var PAGINA_ORIGEM = 'instagram-organico (www.oliveiraimoveis.ia.br)';")
sub("var CONTENT_NAME = 'oportunidade-palmira-655-v2';", "var CONTENT_NAME = 'instagram-organico';")
sub("var MENSAGEM_WHATSAPP = 'Olá, tenho interesse na loja da Palmira 655...';", "var MENSAGEM_WHATSAPP = 'Olá, vim pelo Instagram da Oliveira Imóveis e quero conversar...';")
sub("segmento: 'palmira-655-v2',", "segmento: 'instagram-organico',")
sub("imovel_id: '23',", "imovel_id: '',")
sub("  var PAGE = 'oportunidade-palmira-655-v2';", "  var PAGE = 'instagram-organico';")
anchor = "ATTR = JSON.parse(sessionStorage.getItem('oliveira_utm') || '{}');\n    }\n  }catch(err){}"
sub(anchor, anchor + """
  // ORIGEM CERTIFICADA: esta LP só existe para o Instagram orgânico (link da bio).
  // Independe da URL — fbclid do link da bio NÃO vira anúncio pago.
  (function(){
    var camp = ATTR.utm_campaign && ATTR.utm_campaign !== 'sem_campanha' ? ATTR.utm_campaign : 'instagram-organico';
    var cont = ATTR.anuncio && ATTR.anuncio !== 'sem_anuncio' ? ATTR.anuncio : 'link-da-bio';
    ATTR = Object.assign({}, ATTR, { utm_source: 'instagram', utm_medium: 'organico', utm_campaign: camp, anuncio: cont, fbclid: 'sem_fbclid', placement: 'link-da-bio' });
  })();""")

OUT.write_text(s, encoding='utf-8')
print('ok', OUT, len(s))
