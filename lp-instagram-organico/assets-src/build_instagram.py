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
sub_re(r'(<div class="hero__bg"><img src=")data:image/[^"]+("[^>]*?alt=")[^"]*(")',
       '\\1' + fachada + '\\2Fachada do Centro Comercial Iracema, Rua Palmira, Serra, Belo Horizonte, case da Oliveira Imóveis.\\3') if False else None
s = re.sub(r'(<div class="hero__bg"><img src=")data:image/[^"]+("[^>]*?alt=")[^"]*(")',
           lambda m: m.group(1) + fachada + m.group(2) + 'Fachada do Centro Comercial Iracema, Rua Palmira, Serra, Belo Horizonte, case da Oliveira Imóveis.' + m.group(3), s, count=1, flags=re.S)

# --- hero: textos ---
sub_re(r'<p class="opportunity-badge">.*?</p>', '<p class="opportunity-badge"><span>Imóveis</span> <strong>comerciais em BH</strong></p>')
sub_re(r'<h1 class="hero__title">.*?</h1>', '''<h1 class="hero__title">
      <span>Procurando <strong class="hl">imóvel comercial</strong></span>
      <span>ou com o seu imóvel</span>
      <span>comercial parado?</span>
    </h1>''')
sub_re(r'<p class="hero__text">.*?</p>', '''<p class="hero__text">
      <strong>Mais do que alugar e administrar imóveis.</strong> Posicionamos espaços comerciais com <span class="research-accent">estratégia, curadoria de negócios e marketing digital</span> em Belo Horizonte, desde 2016. Conte quem você é e a gente continua a conversa no WhatsApp.
    </p>''')
sub_re(r'<h2 class="hero-form__title" id="hero-form-title">.*?</h2>', '<h2 class="hero-form__title" id="hero-form-title">Olá, quero falar com a<br />Oliveira Imóveis.</h2>')
sub('aria-label="Quero saber os detalhes dessa loja"><span>Quero saber os detalhes</span>', 'aria-label="Quero falar com a Oliveira Imóveis"><span>Quero falar com a Oliveira</span>')
sub('aria-label="Quero saber os detalhes dessa loja"', 'aria-label="Quero falar com a Oliveira Imóveis"') if 'aria-label="Quero saber os detalhes dessa loja"' in s else None

# --- cartão de provas (site original) ---
sub_re(r'<aside class="opportunity-card".*?</aside>', '''<aside class="opportunity-card" aria-label="Por que a Oliveira Imóveis">
    <div class="opp-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
      <div><strong>Atuando desde 2016 em BH</strong><span>Foco exclusivo em imóveis comerciais</span></div>
    </div>
    <div class="opp-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      <div><strong>Case: Centro Comercial Iracema</strong><span>7 negócios no ecossistema, Rua Palmira, Serra</span></div>
    </div>
    <div class="opp-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3v18h18"/><path d="m7 14 3.5-3.5 3 3L19 7"/><path d="M19 7h-3.6M19 7v3.6"/></svg>
      <div><strong>+30% de faturamento</strong><span>relato de lojista, em menos de um ano</span></div>
    </div>
  </aside>''')

# --- seção "transform": inquilinos x proprietários (textos do site original), mantendo a mesma estrutura/CSS ---
sub('<p class="eyebrow scroll-reveal" style="--reveal-index:0">Fachada e interior</p>', '<p class="eyebrow scroll-reveal" style="--reveal-index:0">Como podemos ajudar</p>')
sub('id="transform-title" style="--reveal-index:1">da última loja do Iracema.</h2>', 'id="transform-title" style="--reveal-index:1">o que você está buscando?</h2>')
sub('<span class="ba-label">Fachada</span>', '<span class="ba-label">Para inquilinos</span>')
sub('<span class="ba-label">Por dentro</span>', '<span class="ba-label">Para proprietários</span>')
s = re.sub(r'alt="Fachada do Centro Comercial Iracema, Rua Palmira 655, com estacionamento na frente\."', 'alt="Fachada do Centro Comercial Iracema, case de ocupação da Oliveira Imóveis."', s, count=1)
s = re.sub(r'alt="Corredor interno da loja de 96 m² na Rua Palmira 655\."', 'alt="Interior de loja pronta no Centro Comercial Iracema."', s, count=1)

# --- seção lead (texto + benefícios) ---
sub_re(r'<h2 id="lead-title"[^>]*>.*?</h2>', '<h2 id="lead-title" class="scroll-reveal" style="--reveal-index:0">Não sabe qual endereço<br />é o certo? Ou seu imóvel<br />está parado?</h2>')
sub_re(r'<p class="lead-sub[^"]*"[^>]*>.*?</p>', '<p class="lead-sub scroll-reveal" style="--reveal-index:1">Escolha seu perfil no formulário e vamos conversar.</p>')
s = s.replace('Ajuda pra decidir se o espaço serve pro seu negócio', 'Leitura da localização para quem procura um ponto')
s = s.replace('Atendimento direto com a Oliveira Imóveis', 'Estratégia para quem quer alugar o imóvel parado')
s = s.replace('aria-label="Quero saber os detalhes dessa loja"', 'aria-label="Quero falar com a Oliveira Imóveis"')
s = s.replace('<span>Quero saber os detalhes</span>', '<span>Quero falar com a Oliveira</span>')

# --- rodapé ---
sub_re(r'<p class="footer__text">.*?</p>', '<p class="footer__text">Mais do que alugar e administrar imóveis comerciais<br />em Belo Horizonte.</p>')

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
