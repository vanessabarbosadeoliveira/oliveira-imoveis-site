// Buritis Saúde & Wellness — Análise de Mercado v5 PPTX
// Editorial design: dark/paper alternation, Georgia (serif) + Calibri (sans), copper/olive accents

const pptxgen = require("pptxgenjs");
const pres = new pptxgen();

// 16:9 widescreen
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.title = "Buritis · Análise de Mercado · Saúde & Wellness · Lojas 15/16";
pres.author = "Oliveira Imóveis";
pres.company = "Oliveira Imóveis";

// ============ DESIGN TOKENS ============
const C = {
  bg: "0f1410",
  bg2: "161d18",
  paper: "f5f1e8",
  paper2: "ece7d8",
  ink: "0a0c0a",
  inkSoft: "1b201c",
  moss: "3d5240",
  sage: "7c9276",
  olive: "b6c39d",
  copper: "c66a3a",
  copperSoft: "e8a577",
  gold: "c9a449",
  red: "b34a3a",
  danger: "8a2f23",
};
const F = { serif: "Georgia", sans: "Calibri", mono: "Consolas" };

const W = 13.333;
const H = 7.5;
const M = 0.9; // margin (aumentada para evitar colisão com rail)
const RAIL_W = 0.55;

// ============ HELPERS ============
function bg(slide, color) {
  slide.background = { color };
}

function rail(slide, dark = true) {
  // Background do rail
  slide.addShape("rect", { x: 0, y: 0, w: RAIL_W, h: H, fill: { color: C.ink }, line: { color: C.ink, width: 0 } });
  // Marca pequena no topo e no rodapé (sem texto rotacionado para evitar wrap)
  slide.addText("O.", { x: 0, y: 0.3, w: RAIL_W, h: 0.5,
    fontFace: F.serif, fontSize: 22, color: C.olive, italic: true, align: "center", valign: "middle" });
  slide.addShape("line", { x: 0.15, y: 0.95, w: RAIL_W - 0.3, h: 0, line: { color: C.olive, width: 0.5 } });
  // Identificação compacta no rodapé do rail
  slide.addText("v5", { x: 0, y: H - 0.9, w: RAIL_W, h: 0.3,
    fontFace: F.mono, fontSize: 8, color: "808066", align: "center", valign: "middle", charSpacing: 1 });
  slide.addText("2026", { x: 0, y: H - 0.55, w: RAIL_W, h: 0.3,
    fontFace: F.mono, fontSize: 7, color: "606060", align: "center", valign: "middle", charSpacing: 1 });
}

function sectionTag(slide, num, word, dark = true) {
  const color = dark ? C.olive : C.moss;
  const accentCopper = C.copper;
  slide.addText([
    { text: "§ ", options: { color: accentCopper, fontFace: F.mono, fontSize: 10, bold: true } },
    { text: num, options: { color: dark ? C.paper : C.ink, fontFace: F.mono, fontSize: 10, charSpacing: 3 } },
  ], { x: M, y: 0.5, w: 2.5, h: 0.3 });
  slide.addText(word.toUpperCase(), {
    x: M, y: 0.78, w: 2.5, h: 0.25,
    fontFace: F.mono, fontSize: 8, color, charSpacing: 4,
  });
}

function footnote(slide, text, dark = true) {
  slide.addText(text, {
    x: M, y: H - 0.4, w: W - M * 2 - 0.3, h: 0.25,
    fontFace: F.mono, fontSize: 8, color: dark ? "606666" : "888877",
    align: "left", charSpacing: 2,
  });
}

// =====================================================================
// SLIDE 1 — CAPA (refeita: layout vertical limpo)
// =====================================================================
let s = pres.addSlide();
bg(s, C.ink);
rail(s);

// Lado esquerdo: tag + headline + sub (todos em coluna)
s.addShape("roundRect", { x: M, y: 0.55, w: 3.6, h: 0.36,
  fill: { color: C.ink }, line: { color: C.sage, width: 0.5 }, rectRadius: 18 });
s.addText([
  { text: "● ", options: { color: C.copper, fontSize: 10 } },
  { text: "INTELIGENCIA COMERCIAL - MAI 2026", options: { color: C.olive, fontFace: F.mono, fontSize: 8, charSpacing: 3 } },
], { x: M, y: 0.55, w: 3.6, h: 0.36, align: "center", valign: "middle" });

s.addText("LOJAS 15 & 16 - PORTOFINO STREET MALL", {
  x: M, y: 1.05, w: 7, h: 0.3,
  fontFace: F.mono, fontSize: 9, color: C.olive, charSpacing: 4,
});

// Headline: cada linha em sua própria caixa para evitar wrap
const headlineLines = [
  { text: ["O que ", { italic: true, color: C.olive, text: "cabe" }], color: C.paper },
  { text: ["no ", { color: C.copperSoft, text: "bairro mais" }], color: C.paper },
  { text: "populoso", color: C.paper },
  { text: "de Minas?", color: C.paper },
];
s.addText([
  { text: "O que ", options: { color: C.paper } },
  { text: "cabe", options: { italic: true, color: C.olive } },
], { x: M, y: 1.5, w: 6.8, h: 0.95, fontFace: F.serif, fontSize: 52, charSpacing: -2 });

s.addText([
  { text: "no ", options: { color: C.paper } },
  { text: "bairro mais", options: { color: C.copperSoft } },
], { x: M, y: 2.4, w: 6.8, h: 0.95, fontFace: F.serif, fontSize: 52, charSpacing: -2 });

s.addText("populoso", { x: M, y: 3.3, w: 6.8, h: 0.95, fontFace: F.serif, fontSize: 52, color: C.paper, charSpacing: -2 });
s.addText("de Minas?", { x: M, y: 4.2, w: 6.8, h: 0.95, fontFace: F.serif, fontSize: 52, color: C.paper, charSpacing: -2 });

// Sub
s.addText("Buritis tem 42 mil moradores, R$ 8.956 por m² e um polo de saúde maduro. Esta pesquisa mapeia, com verificação real no Google Maps, quantas clínicas existem de cada modalidade — e por que as Lojas 15 e 16 do Portofino são o upgrade premium para quem já opera no Buritis.", {
  x: M, y: 5.3, w: 7, h: 1.4,
  fontFace: F.sans, fontSize: 11, color: "b8b3a8", valign: "top", lineSpacingMultiple: 1.4,
});

// Right side stats grid (4x2 = 8 cells)
const statsCells = [
  ["42.342", "Habitantes", "IBGE Censo 2022", true],
  ["17.094", "Domicilios", "IBGE Censo 2022", false],
  ["+32%", "Valor m2 2025", "Diario do Comercio", false],
  ["R$8.9k", "m2 medio", "Portas Imoveis", false],
  ["40", "Modalidades", "Google Maps 2026", false],
  ["1o", "Bairro de BH", "QuintoAndar 2025", true],
  ["17.906", "Medicos BH", "CRM-MG 2024", false],
  ["53,2mi", "Beneficiarios", "ANS dez/2025", false],
];
// Stats grid 2x4 compacto (apenas 2 linhas para liberar espaço para quote)
const sx = 8.05, sy = 1.5, sw = 2.55, sh = 1.4;
for (let i = 0; i < 8; i++) {
  const col = i % 2, row = Math.floor(i / 2);
  // Apenas primeiras 4 stats são mostradas como cards grandes (linhas 0 e 1)
  // Stats 4-7 viram lista compacta abaixo
  if (i >= 4) continue;
  const x = sx + col * (sw + 0.08);
  const y = sy + row * (sh + 0.08);
  const [num, lbl, src, featured] = statsCells[i];
  s.addShape("rect", { x, y, w: sw, h: sh, fill: { color: featured ? C.moss : C.bg2 }, line: { color: "262d28", width: 0.5 } });
  s.addText(num, { x: x + 0.15, y: y + 0.15, w: sw - 0.3, h: 0.6,
    fontFace: F.serif, fontSize: 30, color: featured ? C.olive : C.paper, charSpacing: -1, valign: "top", wrap: false });
  s.addText(lbl, { x: x + 0.15, y: y + 0.78, w: sw - 0.3, h: 0.25,
    fontFace: F.mono, fontSize: 8, color: featured ? C.olive : "8a8576", charSpacing: 2, wrap: false });
  s.addText(src, { x: x + 0.15, y: y + 1.05, w: sw - 0.3, h: 0.25,
    fontFace: F.mono, fontSize: 7, color: featured ? "808066" : "606060", wrap: false });
}
// Stats secundárias em barra horizontal compacta
const bsy = 1.5 + 2 * (1.4 + 0.08); // y após o grid 2x2
const bsw = (sw * 2 + 0.08) / 4; // 4 colunas dentro da mesma largura total
[4,5,6,7].forEach((i, idx) => {
  const x = sx + idx * (bsw + 0.04);
  const [num, lbl, src, featured] = statsCells[i];
  s.addShape("rect", { x, y: bsy, w: bsw, h: 1.0, fill: { color: featured ? C.moss : C.bg2 }, line: { color: "262d28", width: 0.5 } });
  s.addText(num, { x: x + 0.08, y: bsy + 0.12, w: bsw - 0.16, h: 0.4,
    fontFace: F.serif, fontSize: 17, color: featured ? C.olive : C.paper, charSpacing: -1, valign: "top", wrap: false });
  s.addText(lbl, { x: x + 0.08, y: bsy + 0.55, w: bsw - 0.16, h: 0.2,
    fontFace: F.mono, fontSize: 6.5, color: featured ? C.olive : "8a8576", charSpacing: 1, wrap: false });
  s.addText(src, { x: x + 0.08, y: bsy + 0.75, w: bsw - 0.16, h: 0.2,
    fontFace: F.mono, fontSize: 5.5, color: featured ? "808066" : "606060", wrap: false });
});

// Quote
// Quote movido para o painel direito ABAIXO do grid de stats
s.addText([
  { text: "« ", options: { color: C.copperSoft } },
  { text: "Buritis nao tem carencias em saude. Tem oferta consolidada. A oportunidade esta em diferenciacao — e as Lojas 15/16 sao o vetor desse upgrade.", options: { color: C.olive, italic: true } },
  { text: " »", options: { color: C.copperSoft } },
], {
  x: 8.05, y: 5.65, w: 5.2, h: 1.25,
  fontFace: F.serif, fontSize: 12, color: C.olive, italic: true, valign: "top", lineSpacingMultiple: 1.25,
});

// Bottom meta
s.addShape("line", { x: M, y: 6.95, w: W - M - 0.4, h: 0, line: { color: "262d28", width: 0.5 } });
s.addText([
  { text: "LOCALIZACAO\n", options: { color: C.sage, fontFace: F.mono, fontSize: 6.5, charSpacing: 2 } },
  { text: "R. Henrique Badaro Portugal, 405 & 411", options: { color: C.paper, fontFace: F.serif, fontSize: 10 } },
], { x: M, y: 7.05, w: 4.3, h: 0.4 });
s.addText([
  { text: "DOCUMENTO\n", options: { color: C.sage, fontFace: F.mono, fontSize: 6.5, charSpacing: 2 } },
  { text: "v5 - Pesquisa de campo verificada", options: { color: C.paper, fontFace: F.serif, fontSize: 10 } },
], { x: 5.5, y: 7.05, w: 4.5, h: 0.4 });
s.addText([
  { text: "CATEGORIAS\n", options: { color: C.sage, fontFace: F.mono, fontSize: 6.5, charSpacing: 2 } },
  { text: "40 modalidades - Google Maps", options: { color: C.paper, fontFace: F.serif, fontSize: 10 } },
], { x: 10, y: 7.05, w: 3.3, h: 0.4 });

// =====================================================================
// SLIDE 2 — RESUMO EXECUTIVO
// =====================================================================
s = pres.addSlide();
bg(s, C.paper);
rail(s, false);
sectionTag(s, "00", "Resumo Executivo", false);

s.addText([
  { text: "Buritis é o ", options: { color: C.ink } },
  { text: "bairro mais populoso de Minas Gerais", options: { color: C.copper, bold: true } },
  { text: " — 42.342 habitantes, população que cresceu 44% em 12 anos, m² mais valorizado fora da Zona Sul. Esta pesquisa mapeou ", options: { color: C.ink } },
  { text: "40 modalidades de saúde e wellness", options: { color: C.copper, bold: true } },
  { text: " via Google Maps em maio/2026.\n\nA conclusão é clara: ", options: { color: C.ink } },
  { text: "Buritis não tem carências relevantes em saúde — tem polo maduro e consolidado", options: { color: C.moss, italic: true } },
  { text: ". Isso muda a tese das Lojas 15 e 16: não são oportunidades para começar do zero, são ", options: { color: C.ink } },
  { text: "upgrade premium", options: { color: C.copper, bold: true } },
  { text: " para profissionais que já operam no bairro e querem subir ticket médio, qualidade da clientela e visibilidade de marca.", options: { color: C.ink } },
], { x: M, y: 2.3, w: W - M * 2 - 0.3, h: 4,
  fontFace: F.serif, fontSize: 22, color: C.ink, valign: "top",
  lineSpacingMultiple: 1.3,
});

s.addText("Resumo Executivo · 4 movimentos", {
  x: M, y: 1.5, w: 12, h: 0.55,
  fontFace: F.serif, fontSize: 38, color: C.ink, italic: true, charSpacing: -1,
});

footnote(s, "Fontes: IBGE Censo 2022 · ANS · CRM-MG · Doctoralia · Google Maps · Buritis Juntos · Associação Bairro Buritis", false);

// =====================================================================
// SLIDE 3 — DEMOGRAFIA
// =====================================================================
s = pres.addSlide();
bg(s, C.paper);
rail(s, false);
sectionTag(s, "01", "O Bairro", false);

s.addText([
  { text: "Quem mora — ", options: { color: C.ink } },
  { text: "e quem consome saúde", options: { color: C.moss, italic: true } },
  { text: " — no Buritis.", options: { color: C.ink } },
], { x: M, y: 1.3, w: 12, h: 0.85, fontFace: F.serif, fontSize: 38, color: C.ink, charSpacing: -1 });

const demoCells = [
  { label: "POPULAÇÃO TOTAL", big: "42.342", unit: "habitantes", desc: "Bairro mais populoso de MG e de BH. Ganhou 13 mil moradores desde 2010.", src: "[01] IBGE Censo 2022", dark: true },
  { label: "DOMICÍLIOS OCUPADOS", big: "17.094", unit: "moradias", desc: "Densidade de 2,48 pessoas por imóvel.", src: "[01] IBGE", dark: false },
  { label: "BAIRRO MAIS PROCURADO", big: "1º", unit: "de BH", desc: "QuintoAndar 2025 confirma Buritis como o destino mais buscado.", src: "[02] QuintoAndar", dark: false },
  { label: "VALOR MÉDIO M²", big: "R$8.956", unit: "/ m²", desc: "Um dos m² mais caros fora da Zona Sul de BH.", src: "[03] Portas 2025", dark: false },
  { label: "VALORIZAÇÃO 2025", big: "+32%", unit: "imóveis 125m²+", desc: "Top 3 da capital. +34% para imóveis menores.", src: "[04] Diário do Comércio", dark: true },
  { label: "PERFIL ECONÔMICO", big: "Renda média-alta", unit: "", desc: "Famílias 30-55 anos, com plano de saúde, alta capacidade de gasto particular.", src: "[05] Prefeitura BH", dark: false },
];

const dx0 = M, dy0 = 2.6, dw = 4.0, dh = 2.0, dgap = 0.13;
demoCells.forEach((cell, i) => {
  const col = i % 3, row = Math.floor(i / 3);
  const x = dx0 + col * (dw + dgap);
  const y = dy0 + row * (dh + dgap);
  const fill = cell.dark ? C.ink : C.paper2;
  const ink = cell.dark ? C.paper : C.ink;
  s.addShape("rect", { x, y, w: dw, h: dh, fill: { color: fill }, line: { color: "d0c8b8", width: 0.5 } });
  s.addText(cell.label, { x: x + 0.25, y: y + 0.2, w: dw - 0.5, h: 0.22,
    fontFace: F.mono, fontSize: 7, color: cell.dark ? C.olive : C.moss, charSpacing: 3 });
  s.addText([
    { text: cell.big, options: { color: ink } },
    { text: cell.unit ? "  " + cell.unit : "", options: { color: cell.dark ? C.olive : C.moss, italic: true, fontSize: 14 } },
  ], { x: x + 0.25, y: y + 0.45, w: dw - 0.5, h: 0.7,
    fontFace: F.serif, fontSize: 30, color: ink, charSpacing: -1 });
  s.addText(cell.desc, { x: x + 0.25, y: y + 1.2, w: dw - 0.5, h: 0.5,
    fontFace: F.sans, fontSize: 9.5, color: cell.dark ? "b8b3a8" : "555550" });
  s.addText(cell.src, { x: x + 0.25, y: y + 1.7, w: dw - 0.5, h: 0.2,
    fontFace: F.mono, fontSize: 7, color: cell.dark ? C.copperSoft : C.copper });
});

// =====================================================================
// SLIDE 4 — MERCADO BRASIL · TENDÊNCIAS
// =====================================================================
s = pres.addSlide();
bg(s, C.ink);
rail(s);
sectionTag(s, "02", "O Setor");

s.addText([
  { text: "O Brasil ", options: { color: C.paper } },
  { text: "nunca consumiu", options: { color: C.olive, italic: true } },
  { text: " tanta saúde\ne bem-estar.", options: { color: C.paper } },
], { x: M, y: 1.3, w: 11, h: 1.5, fontFace: F.serif, fontSize: 38, color: C.paper, charSpacing: -1, lineSpacingMultiple: 1 });

const trends = [
  { lbl: "SAÚDE SUPLEMENTAR · ANS", stat: "53,2 mi", title: "Beneficiários de planos médicos · dez/2025", desc: "MG entre estados com maior crescimento absoluto.", src: "[06] ANS dez/2025" },
  { lbl: "SAÚDE MENTAL · DOCTORALIA", stat: "+18,5%", title: "Crescimento de consultas psi/psiquiatria em 2025", desc: "11,2 milhões de consultas. 54% apontam como problema #1.", src: "[07] Brazil Health 2025" },
  { lbl: "BELEZA & WELLNESS · SEBRAE", stat: "R$ 242 bi", title: "Movimentou o setor em 2025", desc: "Crescimento de 11,2%. Brasil é 3º maior mercado mundial.", src: "[08] Sebrae 2025" },
  { lbl: "FISIOTERAPIA · COFFITO", stat: "CAGR 13,8%", title: "Projeção de crescimento até 2031", desc: "Profissão cresceu 184% na última década.", src: "[09] COFFITO · GGI" },
  { lbl: "MEDICINA INTEGRATIVA · OMS", stat: "76%", title: "Da população mundial usa práticas integrativas", desc: "OMS lançou Estratégia Global 2025-2034.", src: "[10] OMS" },
  { lbl: "LONGEVIDADE · IPSOS", stat: "64%", title: "Brasileiros mudaram hábitos para prevenir crônicas", desc: "Medicina preventiva deixou de ser nicho.", src: "[11] Ipsos · Sírio-Libanês" },
];

const tx0 = M, ty0 = 3.2, tw = 4.0, th = 1.85, tgap = 0.12;
trends.forEach((t, i) => {
  const col = i % 3, row = Math.floor(i / 3);
  const x = tx0 + col * (tw + tgap), y = ty0 + row * (th + tgap);
  s.addShape("rect", { x, y, w: tw, h: th, fill: { color: C.bg2 }, line: { color: "262d28", width: 0.5 } });
  s.addText(t.lbl, { x: x + 0.2, y: y + 0.15, w: tw - 0.4, h: 0.22,
    fontFace: F.mono, fontSize: 7, color: C.olive, charSpacing: 3 });
  s.addText(t.stat, { x: x + 0.2, y: y + 0.4, w: tw - 0.4, h: 0.5,
    fontFace: F.serif, fontSize: 28, color: C.copperSoft, charSpacing: -1 });
  s.addText(t.title, { x: x + 0.2, y: y + 0.9, w: tw - 0.4, h: 0.45,
    fontFace: F.serif, fontSize: 12, color: C.paper, bold: true });
  s.addText(t.desc, { x: x + 0.2, y: y + 1.35, w: tw - 0.4, h: 0.32,
    fontFace: F.sans, fontSize: 8.5, color: "b8b3a8" });
  s.addText(t.src, { x: x + 0.2, y: y + 1.62, w: tw - 0.4, h: 0.2,
    fontFace: F.mono, fontSize: 6, color: C.moss });
});

// =====================================================================
// HELPER: Modalidade Table Row
// =====================================================================
function modalRow(slide, y, num, name, sub, qty, status, statusColor, refs) {
  // Layout: 0.4(num) 3.6(cat) 0.95(qty) 1.15(status) 6.0(refs)
  // Total: 12.1 inches. M=0.9 → x0=0.9, ends at 13.0 (slide W=13.333) ✓
  const x0 = M;
  slide.addText(num, { x: x0, y, w: 0.4, h: 0.55,
    fontFace: F.mono, fontSize: 9, color: C.copperSoft, align: "center", valign: "middle" });
  slide.addText([
    { text: name, options: { color: C.paper, fontFace: F.serif, fontSize: 12 } },
    { text: "\n" + sub, options: { color: "808066", fontFace: F.sans, fontSize: 8 } },
  ], { x: x0 + 0.45, y, w: 3.6, h: 0.55, valign: "middle" });
  slide.addText(qty, { x: x0 + 4.1, y, w: 0.95, h: 0.55,
    fontFace: F.serif, fontSize: 16, color: statusColor, align: "center", valign: "middle", bold: true, wrap: false });
  slide.addShape("roundRect", { x: x0 + 5.15, y: y + 0.13, w: 1.15, h: 0.3,
    fill: { color: statusColor }, line: { color: statusColor, width: 0 }, rectRadius: 12 });
  slide.addText(status, { x: x0 + 5.15, y: y + 0.13, w: 1.15, h: 0.3,
    fontFace: F.mono, fontSize: 7, color: status === "Saturado" || status === "Alta" ? C.paper : C.ink, align: "center", valign: "middle", charSpacing: 2, wrap: false });
  slide.addText(refs, { x: x0 + 6.45, y, w: 5.85, h: 0.55,
    fontFace: F.sans, fontSize: 9, color: "b0aaa0", valign: "middle" });
}

function modalCatHeader(slide, y, letter, name) {
  const x0 = M;
  slide.addShape("rect", { x: x0, y, w: W - M - 0.4, h: 0.4, fill: { color: C.moss }, line: { color: C.moss, width: 0 } });
  slide.addText(letter, { x: x0 + 0.15, y, w: 0.35, h: 0.4,
    fontFace: F.serif, fontSize: 22, color: C.olive, align: "center", valign: "middle" });
  slide.addText(name, { x: x0 + 0.6, y, w: 10, h: 0.4,
    fontFace: F.mono, fontSize: 9, color: C.olive, valign: "middle", charSpacing: 3 });
}

// =====================================================================
// SLIDE 5 — §03a · Médico generalista (A1-7)
// =====================================================================
s = pres.addSlide();
bg(s, C.ink);
rail(s);
sectionTag(s, "03", "Pesquisa de Campo · Google Maps");
s.addText([
  { text: "O que ", options: { color: C.paper } },
  { text: "já existe", options: { color: C.olive, italic: true } },
  { text: " no Buritis. 40 modalidades.", options: { color: C.paper } },
], { x: M, y: 1.3, w: 12, h: 0.85, fontFace: F.serif, fontSize: 32, color: C.paper, charSpacing: -1 });

modalCatHeader(s, 2.3, "A", "MÉDICO GENERALISTA & ESPECIALIDADES (1/2)");

let cy = 2.85;
const rowH = 0.6;
[
  ["01", "Clínica multi-especialidade", "10 a 25 especialidades sob mesmo teto", "6-10", "Alta", C.copper, "Dr. Buritis (20+ esp.), Clínica Versa, Cuidati, Biocenter, Vista Clinic, BioNúcleo, Savíta."],
  ["02", "Clínico geral", "consultórios particulares de medicina", "10+", "Saturado", C.danger, "Dentro de Dr. Buritis, Vista Clinic, Biocenter + dezenas de consultórios individuais."],
  ["03", "Pediatria", "consulta R$ 250-400 particular", "6-10", "Alta", C.copper, "Biocenter, Cuidati, Herika Bicalho, Julia Correa, Miriam Georgetti."],
  ["04", "Ginecologia & Obstetrícia", "consulta + acompanhamento gestacional", "10+", "Saturado", C.danger, "Dr. Buritis, Vista Clinic, Versa, Savíta + dezenas no Doctoralia/Kekanto."],
  ["05", "Cardiologia", "consulta + ECG + ergometria", "3-5", "Média", C.gold, "Dr. Buritis (Walter Figueiredo 90), referência adicional na José Rodrigues Pereira 819."],
  ["06", "Ortopedia", "consulta + infiltração + reabilitação", "6-10", "Alta", C.copper, "Clínica Dr. Oswaldo Drumond (Mário Werneck 2900), Dr. Buritis, Salutem, Biocenter."],
  ["07", "Dermatologia", "médica + estética + cirúrgica", "10+", "Saturado", C.danger, "Dra. Simone Helena, Dr. Bernardo Patrus, Biocenter, Maison Blanc, Cosmedic."],
].forEach(r => { modalRow(s, cy, ...r); cy += rowH; });

footnote(s, "Fontes: Buritis Juntos · ABB · Doctoralia · Apontador · GuiaMais · BoaConsulta · sites próprios · Google Maps mai/2026");

// =====================================================================
// SLIDE 6 — §03b · Médico (A8-13) + B Saúde Mental + C Odonto
// =====================================================================
s = pres.addSlide();
bg(s, C.ink);
rail(s);
sectionTag(s, "03", "Pesquisa de Campo · Google Maps");
s.addText("Modalidades · A (parte 2), B & C", {
  x: M, y: 1.3, w: 12, h: 0.7, fontFace: F.serif, fontSize: 30, color: C.paper, italic: true, charSpacing: -1 });

cy = 2.1;
modalCatHeader(s, cy, "A", "MÉDICO GENERALISTA & ESPECIALIDADES (2/2)"); cy += 0.5;
[
  ["08", "Oftalmologia", "consulta + exames + cirurgia", "6-10", "Alta", C.copper, "Vista Clinic (dedicada · Mário Werneck 2375), Clínica de Olhos Buritis, Ricardo Guimarães."],
  ["09", "Otorrinolaringologia", "consulta + audiometria + cirurgia", "3-5", "Média", C.gold, "Clínica Parlare + Dr. Buritis Centro Médico."],
  ["10", "Endocrinologia", "consulta + acompanhamento metabólico", "3-5", "Média", C.gold, "Dr. Buritis, Clínica Dr. Oswaldo Drumond + cadastros BoaConsulta."],
  ["11", "Gastroenterologia", "consulta + endoscopia (encaminhada)", "1-2", "Pouca", C.olive, "Dentro do Dr. Buritis. Oferta dedicada rara."],
  ["12", "Neurologia", "consulta + investigação", "3-5", "Média", C.gold, "Dr. Buritis + consultórios individuais cadastrados."],
  ["13", "Urologia", "consulta + exames + cirurgia (encam.)", "1-2", "Pouca", C.olive, "Dentro do Dr. Buritis Centro Médico. Única referência fixa."],
].forEach(r => { modalRow(s, cy, ...r); cy += rowH; });

cy += 0.05;
modalCatHeader(s, cy, "B", "SAÚDE MENTAL"); cy += 0.5;
[
  ["14", "Psicologia", "consultórios individuais", "20+", "Saturado", C.danger, "Núcleo Flávia Gontijo + consultórios em Mário Werneck 2170/2501, Carlos Goulart 100."],
  ["15", "Psiquiatria", "consulta + acompanhamento", "6-10", "Alta", C.copper, "Dr. Filipe Baroni, Núcleo Flávia Gontijo, MIND CENTER PSIQUIATRIA (Estoril)."],
].forEach(r => { modalRow(s, cy, ...r); cy += rowH; });

footnote(s, "Fontes: Buritis Juntos · Doctoralia · BoaConsulta · Vista Clinic · Mundo dos Psicólogos · Google Maps mai/2026");

// =====================================================================
// SLIDE 7 — §03c · C Odonto + D Movimento (1)
// =====================================================================
s = pres.addSlide();
bg(s, C.ink);
rail(s);
sectionTag(s, "03", "Pesquisa de Campo · Google Maps");
s.addText("Modalidades · C Odontologia & D Movimento (1/2)", {
  x: M, y: 1.3, w: 12, h: 0.7, fontFace: F.serif, fontSize: 26, color: C.paper, italic: true, charSpacing: -1 });

cy = 2.1;
modalCatHeader(s, cy, "C", "ODONTOLOGIA"); cy += 0.5;
[
  ["16", "Odontologia geral", "a categoria mais saturada do bairro", "30+", "Saturado", C.danger, "Dentz, COAE, Odontho, Tratar, OdontoCompany, Odonto Viva, Oro (HBP 435 — vizinha Loja 15)."],
  ["17", "Implantodontia", "implante + carga imediata", "10+", "Saturado", C.danger, "Oral Sin Buritis (maior de BH), Sourire Blanc, Odonto Viva, Oro Odontologia, Salutem."],
  ["18", "Ortodontia", "aparelho fixo + Invisalign", "10+", "Saturado", C.danger, "Oro, Oral Sin, Tratar, Detallis Odonto, Salutem, Dra. Wellvytha Freitas."],
  ["19", "Harmonização orofacial", "botox + preenchimento + fios", "6-10", "Alta", C.copper, "Raquel Bittencourt (Alessandra Salum Cadar 11), Botopremium, COAE, Salutem."],
].forEach(r => { modalRow(s, cy, ...r); cy += rowH; });

cy += 0.1;
modalCatHeader(s, cy, "D", "MOVIMENTO & REABILITAÇÃO (1/2)"); cy += 0.5;
[
  ["20", "Fisioterapia (clínicas)", "RPG + traumato + esportiva + pélvica", "10+", "Saturado", C.danger, "Salutem, Versa, Plênima, Vitruvie, Clínica Flow, TheraFit, POSTURAL FIT, Sem Impacto, Doutor Hérnia."],
  ["21", "Pilates", "estúdios solo + aparelhos + terapêutico", "10+", "Saturado", C.danger, "Line Pilates, Studio Hiury, Fine Corpore, Arena Pilates, Bárbara Pimentel, LM Pilates."],
].forEach(r => { modalRow(s, cy, ...r); cy += rowH; });

footnote(s, "Fontes: Buritis Juntos · ABB · Oral Sin · Gympass · Google Maps mai/2026");

// =====================================================================
// SLIDE 8 — §03d · D Movimento (2) + E Estética
// =====================================================================
s = pres.addSlide();
bg(s, C.ink);
rail(s);
sectionTag(s, "03", "Pesquisa de Campo · Google Maps");
s.addText("Modalidades · D Movimento (2/2) & E Estética/Wellness", {
  x: M, y: 1.3, w: 12, h: 0.7, fontFace: F.serif, fontSize: 26, color: C.paper, italic: true, charSpacing: -1 });

cy = 2.1;
modalCatHeader(s, cy, "D", "MOVIMENTO & REABILITAÇÃO (2/2)"); cy += 0.5;
[
  ["22", "Quiropraxia / Osteopatia", "manipulação articular + crânio-sacral", "3-5", "Média", C.gold, "Plênima Osteopatia (Dr. Elias Alvarenga), Salutem, Clínica Flow, Doutor Hérnia."],
  ["23", "Acupuntura", "tradicional + estética + auriculoterapia", "3-5", "Média", C.gold, "Dra. Daniela Galvão (Mário Werneck 882), Versa, Dermaponto Estética e Acupuntura."],
  ["24", "Crossfit / Funcional", "boxes dedicados", "6-10", "Alta", C.copper, "C2 Cross Center, UBH Crossfit, Ares, Ultra Fit Camp, CrossLeague BH, Contorno do Corpo, Khan."],
  ["25", "Yoga", "studios dedicados", "3-5", "Média", C.gold, "Iogue Studio, Núcleo Satya, Espaço Viver de Yoga."],
  ["26", "Academia tradicional", "musculação + cardio", "10+", "Saturado", C.danger, "Smart Fit (2 unidades), Bluefit, Contorno do Corpo, Academia Imagem, Acqua Club, Overall Gym."],
].forEach(r => { modalRow(s, cy, ...r); cy += rowH; });

cy += 0.1;
modalCatHeader(s, cy, "E", "ESTÉTICA & WELLNESS (1/2)"); cy += 0.5;
[
  ["27", "Estética avançada", "HIFU, botox, fios, biostimulator", "10+", "Saturado", C.danger, "Dra. Mylena Braga, Performance, Face & Body, COAE, Botopremium, Aprimori, Bela Performance."],
].forEach(r => { modalRow(s, cy, ...r); cy += rowH; });

footnote(s, "Fontes: Buritis Juntos · ABB · Gympass · Revista Encontro · EstéticaGuia · Google Maps mai/2026");

// =====================================================================
// SLIDE 9 — §03e · E Estética (2) + F Bem-estar + G Apoio
// =====================================================================
s = pres.addSlide();
bg(s, C.ink);
rail(s);
sectionTag(s, "03", "Pesquisa de Campo · Google Maps");
s.addText("Modalidades · E (2/2), F Bem-estar & G Apoio", {
  x: M, y: 1.3, w: 12, h: 0.7, fontFace: F.serif, fontSize: 26, color: C.paper, italic: true, charSpacing: -1 });

cy = 2.1;
modalCatHeader(s, cy, "E", "ESTÉTICA & WELLNESS (2/2)"); cy += 0.5;
[
  ["28", "Spa / Massagem", "terapêutica + relaxante + tailandesa", "6-10", "Alta", C.copper, "Spa Paula Asevedo (HBP 480 — vizinho Loja 15/17!), Espaço Cuidartte, Art Day Spa, Priscila Sanches."],
  ["29", "Tricologia / Capilar", "PRP + queda + saúde capilar", "3-5", "Média", C.gold, "Os Romanos (Maria Heilbuth 848), Capilar TURBO10 (HBP 395 — vizinho!), Instituto Dra Ludimila."],
  ["30", "Drenagem / Criolipólise", "corpo + pós-cirúrgico", "6-10", "Alta", C.copper, "Buona Pelle, Face & Body, Performance, Aprimori, Maria Rita Drenagem, Criolipólise Cooltech."],
  ["31", "Depilação a laser", "diodo, IPL, ndYAG", "6-10", "Alta", C.copper, "Deep Buritis, MaisLaser Ana Hickmann, LaserDream, Bela Performance, Face & Body."],
  ["32", "Esmalteria / Nail", "manicure + design", "6-10", "Alta", C.copper, "Clous, Suav, Top Nail, GLAMGLOW (HBP 429), Pink Me Up (HBP 449), Esmalteria Buritis (HBP 455)."],
].forEach(r => { modalRow(s, cy, ...r); cy += rowH; });

cy += 0.1;
modalCatHeader(s, cy, "F·G", "BEM-ESTAR + APOIO (RESUMO)"); cy += 0.5;
[
  ["33-40", "Nutrição (10+ · sat), Personal (20+ · sat)", "Recovery (1-2), Farmácia mag. (3-5), Imagem (1-2), Lab (3-5), Vet (6-10), Geriatria (6-10)", "—", "Misto", C.copperSoft, "Detalhes completos em §03 do HTML — todas com 2+ fontes e endereços confirmados."],
].forEach(r => { modalRow(s, cy, ...r); cy += rowH; });

footnote(s, "Fontes: Buritis Juntos · ABB · Doctoralia · O Melhor do Bairro · Hermes Pardini · Google Maps mai/2026");

// =====================================================================
// SLIDE 10 — SATURAÇÃO + PADRÃO DA AVENIDA
// =====================================================================
s = pres.addSlide();
bg(s, C.ink);
rail(s);
sectionTag(s, "03", "Síntese");
s.addText([
  { text: "O que ", options: { color: C.paper } },
  { text: "satura", options: { color: C.olive, italic: true } },
  { text: " e onde a oferta é ", options: { color: C.paper } },
  { text: "enxuta", options: { color: C.olive, italic: true } },
  { text: ".", options: { color: C.paper } },
], { x: M, y: 1.3, w: 12, h: 0.85, fontFace: F.serif, fontSize: 32, color: C.paper, charSpacing: -1 });

const synth = [
  { color: C.danger, lbl: "SATURADAS · 10+ PLAYERS", title: "11 modalidades em concorrência intensa", list: "Odontologia geral (30+), Personal (20+), Psicologia (20+), Clínico geral, Ginecologia, Dermatologia, Estética avançada, Fisioterapia, Pilates, Implantodontia, Ortodontia, Academia, Nutrição." },
  { color: C.copper, lbl: "ALTA DENSIDADE · 6-10 PLAYERS", title: "13 modalidades com oferta abundante", list: "Clínica multi, Pediatria, Ortopedia, Oftalmologia, Psiquiatria, Harmonização orofacial, Crossfit, Spa/Massagem, Drenagem/Criolipólise, Depilação a laser, Esmalteria, Veterinária, Geriatria." },
  { color: C.gold, lbl: "OFERTA ENXUTA · 1-5 PLAYERS", title: "Modalidades com menos concorrência", list: "Cardiologia, Otorrino, Endocrinologia, Gastroenterologia, Neurologia, Urologia, Quiropraxia/Osteopatia, Acupuntura, Yoga, Tricologia, Recovery, Farmácia manipulação, Diagnóstico imagem, Laboratório." },
];
const cx0 = M, cy0 = 2.5, cw = 4.0, ch_card = 2.6, cgap = 0.13;
synth.forEach((c, i) => {
  const x = cx0 + i * (cw + cgap);
  s.addShape("rect", { x, y: cy0, w: cw, h: ch_card, fill: { color: "1a2120" }, line: { color: c.color, width: 2 } });
  s.addShape("rect", { x, y: cy0, w: 0.08, h: ch_card, fill: { color: c.color }, line: { color: c.color, width: 0 } });
  s.addText(c.lbl, { x: x + 0.25, y: cy0 + 0.2, w: cw - 0.5, h: 0.25,
    fontFace: F.mono, fontSize: 7, color: C.olive, charSpacing: 3 });
  s.addText(c.title, { x: x + 0.25, y: cy0 + 0.5, w: cw - 0.5, h: 0.5,
    fontFace: F.serif, fontSize: 14, color: C.paper, bold: true });
  s.addText(c.list, { x: x + 0.25, y: cy0 + 1.1, w: cw - 0.5, h: 1.4,
    fontFace: F.sans, fontSize: 9.5, color: "b0aaa0", valign: "top" });
});

// Padrão da Avenida
s.addShape("rect", { x: M, y: 5.4, w: W - 2 * M - 0.6, h: 1.5, fill: { color: C.bg2 }, line: { color: C.copper, width: 2 } });
s.addShape("rect", { x: M, y: 5.4, w: 0.06, h: 1.5, fill: { color: C.copper }, line: { color: C.copper, width: 0 } });
s.addText("PADRÃO DO BAIRRO", { x: M + 0.5, y: 5.55, w: 3.5, h: 0.25,
  fontFace: F.mono, fontSize: 8, color: C.copperSoft, charSpacing: 3 });
s.addText([
  { text: "Avenida Professor Mário Werneck", options: { color: C.copperSoft, bold: true } },
  { text: " é a espinha dorsal de saúde do Buritis — endereços 1175, 1240, 1309, 1805, 2060, 2220, 2375, 2900, 3282 todos abrigam clínicas relevantes. Eixos secundários fortes na ", options: { color: C.paper } },
  { text: "Rua Cristiano Moreira Sales", options: { color: C.olive, italic: true } },
  { text: " (Salutem/Cuidati) e ", options: { color: C.paper } },
  { text: "Rua Walter Guimarães Figueiredo", options: { color: C.olive, italic: true } },
  { text: " (Dr. Buritis). A ", options: { color: C.paper } },
  { text: "Rua Henrique Badaró Portugal — onde estão as Lojas 15 e 16 — é o eixo emergente", options: { color: C.copperSoft, bold: true } },
  { text: " com Oro Odontologia (435), Odonto Biológica (480), Spa Paula Asevedo (480), Capilar TURBO10 (395).", options: { color: C.paper } },
], { x: M + 0.5, y: 5.85, w: W - 2 * M - 1, h: 0.95,
  fontFace: F.sans, fontSize: 11, color: C.paper, valign: "top" });

// =====================================================================
// SLIDE 11 — §04 PIVOT · TESE DO UPGRADE
// =====================================================================
s = pres.addSlide();
bg(s, C.paper);
rail(s, false);
sectionTag(s, "04", "Tese de Mercado", false);

s.addText([
  { text: "As Lojas 15 e 16\nsão ", options: { color: C.ink } },
  { text: "upgrade", options: { color: C.copper, italic: true } },
  { text: ", não start.", options: { color: C.ink } },
], { x: M, y: 1.5, w: 7, h: 2.5, fontFace: F.serif, fontSize: 48, color: C.ink, charSpacing: -2, lineSpacingMultiple: 1.0 });

s.addText("Buritis tem mercado saturado em quase tudo — mas saturado em qualidade média. Salas pequenas em prédios comerciais, fachadas discretas, fluxo dependente de Google. As Lojas 15 e 16 do Portofino Street Mall mudam o jogo para quem já está estabelecido: nova fachada, eixo comercial de rua, vizinhança premium, presença de marca. É o vetor que separa o profissional anônimo do consultório-marca.", {
  x: 7.4, y: 1.7, w: 5.3, h: 4,
  fontFace: F.serif, fontSize: 16, color: "3a3a35", italic: false, valign: "top", lineSpacingMultiple: 1.4 });

s.addText([
  { text: "POR QUE AGORA?\n", options: { color: C.moss, fontFace: F.mono, fontSize: 9, charSpacing: 3 } },
  { text: "\nMercado de saude, beleza e bem-estar movimentou R$ 242 bi em 2025 (Sebrae). Saude mental cresceu 18,5%, fisioterapia projeta CAGR de 13,8%. Plano de saude no Brasil bateu 53,2 milhoes de beneficiarios — o vento esta a favor.", options: { color: C.ink, fontFace: F.serif, fontSize: 14 } },
], { x: M, y: 4.6, w: 7, h: 2.2, valign: "top" });

footnote(s, "Tese: upgrade vs. start. Lojas Portofino capturam profissionais já operantes que buscam reposicionamento.", false);

// =====================================================================
// SLIDE 12 — ANTES × DEPOIS
// =====================================================================
s = pres.addSlide();
bg(s, C.paper);
rail(s, false);
sectionTag(s, "04.1", "Antes × Depois", false);

s.addText("O salto operacional.", {
  x: M, y: 1.3, w: 12, h: 0.7, fontFace: F.serif, fontSize: 36, color: C.ink, italic: true, charSpacing: -1 });

// ANTES (left)
const bx = M, by = 2.3, bw_ = 5.85, bh = 4.6;
s.addShape("rect", { x: bx, y: by, w: bw_, h: bh, fill: { color: C.paper2 }, line: { color: "d0c8b8", width: 0.5 } });
s.addText("OPERAÇÃO TÍPICA · CONCORRENTE BURITIS HOJE", {
  x: bx + 0.3, y: by + 0.3, w: bw_ - 0.6, h: 0.25,
  fontFace: F.mono, fontSize: 8, color: C.moss, charSpacing: 3 });
s.addText([
  { text: "Onde a maioria ", options: { color: C.ink } },
  { text: "opera hoje", options: { italic: true, color: C.ink } },
], { x: bx + 0.3, y: by + 0.6, w: bw_ - 0.6, h: 0.7,
  fontFace: F.serif, fontSize: 24, color: C.ink, charSpacing: -1 });

const antesItems = [
  "Sala em prédio comercial (andar alto) — fluxo zero de rua",
  "Fachada inexistente — placa pequena na entrada compartilhada",
  "Vizinhança neutra — escritórios, sem público de saúde",
  "Sem estacionamento dedicado — paciente disputa vaga",
  "Branding limitado — não pode personalizar fachada",
  "Ticket médio puxado para baixo — preço de \"sala comercial\"",
];
antesItems.forEach((it, i) => {
  const y_ = by + 1.5 + i * 0.48;
  s.addText("×", { x: bx + 0.3, y: y_, w: 0.3, h: 0.4,
    fontFace: F.serif, fontSize: 18, color: C.copper, valign: "top" });
  s.addText(it, { x: bx + 0.6, y: y_, w: bw_ - 0.9, h: 0.42,
    fontFace: F.sans, fontSize: 11, color: "3a3a35", valign: "top" });
});

// DEPOIS (right)
const dx_ = bx + bw_ + 0.13, dy_ = by;
s.addShape("rect", { x: dx_, y: dy_, w: bw_, h: bh, fill: { color: C.ink } });
s.addText("OPERAÇÃO PREMIUM · LOJAS 16/17 PORTOFINO", {
  x: dx_ + 0.3, y: dy_ + 0.3, w: bw_ - 0.6, h: 0.25,
  fontFace: F.mono, fontSize: 8, color: C.olive, charSpacing: 3 });
s.addText([
  { text: "O que muda ", options: { color: C.paper } },
  { text: "aqui", options: { italic: true, color: C.olive } },
], { x: dx_ + 0.3, y: dy_ + 0.6, w: bw_ - 0.6, h: 0.7,
  fontFace: F.serif, fontSize: 24, color: C.paper, charSpacing: -1 });

const depoisItems = [
  "Loja de rua térrea — fluxo orgânico do Portofino + da HBP",
  "Fachada premium personalizável — marca visível milhares/dia",
  "Vizinhança de saúde & beleza — Oro, Odonto Biológica, Spa, TURBO10",
  "Mall com estacionamento — valet, conveniência premium",
  "Branding completo — fachada, vitrine, identidade exterior",
  "Ticket médio sobe — paciente associa loja premium a serviço premium",
];
depoisItems.forEach((it, i) => {
  const y_ = dy_ + 1.5 + i * 0.48;
  s.addText("✓", { x: dx_ + 0.3, y: y_, w: 0.3, h: 0.4,
    fontFace: F.serif, fontSize: 14, color: C.olive, valign: "top" });
  s.addText(it, { x: dx_ + 0.6, y: y_, w: bw_ - 0.9, h: 0.42,
    fontFace: F.sans, fontSize: 11, color: C.paper, valign: "top" });
});

// =====================================================================
// SLIDE 13 — PERSONAS
// =====================================================================
s = pres.addSlide();
bg(s, C.ink);
rail(s);
sectionTag(s, "04.2", "Persona Alvo");
s.addText("Para quem isso faz sentido.", {
  x: M, y: 1.3, w: 12, h: 0.7, fontFace: F.serif, fontSize: 36, color: C.paper, italic: true, charSpacing: -1 });

const personas = [
  { num: "01", role: "PROFISSIONAL ESTABELECIDO", title: "O dentista, fisio ou esteta que já fatura no bairro",
    pitch: "Já tem clientela formada em sala alugada de prédio comercial. Quer subir o ticket médio em 30-50% e atrair clientela classe A. O upgrade para loja de rua é o próximo movimento natural.",
    signal: "Aluguel atual R$ 2-4k em sala compartilhada" },
  { num: "02", role: "MARCA EM EXPANSÃO", title: "A rede ou franquia que quer entrar no Buritis premium",
    pitch: "Não quer abrir mais uma sala em prédio — quer chegar com fachada e visibilidade desde o dia 1. Marcas de estética, harmonização, tricologia, recovery, wellness premium são o perfil natural.",
    signal: "Marca com 2+ unidades em outros bairros" },
  { num: "03", role: "SOCIEDADE DE PROFISSIONAIS", title: "O grupo montando clínica multidisciplinar nova",
    pitch: "3-5 profissionais complementares (médico + fisio + psi + nutri) querem abrir clínica integrada. Loja térrea com fachada própria posiciona o grupo como referência, não como mais um consultório.",
    signal: "Profissionais em fase de constituição de PJ" },
];

const px0 = M, py0 = 2.3, pw = 4.0, ph = 4.5, pgap = 0.13;
personas.forEach((p, i) => {
  const x = px0 + i * (pw + pgap);
  s.addShape("rect", { x, y: py0, w: pw, h: ph, fill: { color: C.bg2 }, line: { color: "262d28", width: 0.5 } });
  s.addText(p.num, { x: x + 0.3, y: py0 + 0.2, w: 2, h: 0.7,
    fontFace: F.serif, fontSize: 42, color: C.copper, charSpacing: -1 });
  s.addText(p.role, { x: x + 0.3, y: py0 + 1, w: pw - 0.6, h: 0.22,
    fontFace: F.mono, fontSize: 7, color: C.moss, charSpacing: 3 });
  s.addText(p.title, { x: x + 0.3, y: py0 + 1.3, w: pw - 0.6, h: 0.9,
    fontFace: F.serif, fontSize: 15, color: C.paper, bold: true, lineSpacingMultiple: 1.1 });
  s.addText(p.pitch, { x: x + 0.3, y: py0 + 2.3, w: pw - 0.6, h: 1.6,
    fontFace: F.sans, fontSize: 10, color: "b0aaa0", valign: "top", lineSpacingMultiple: 1.3 });
  s.addShape("line", { x: x + 0.3, y: py0 + 4.0, w: pw - 0.6, h: 0,
    line: { color: "404840", width: 0.5, dashType: "dash" } });
  s.addText("SINAL: " + p.signal, { x: x + 0.3, y: py0 + 4.1, w: pw - 0.6, h: 0.3,
    fontFace: F.mono, fontSize: 7.5, color: C.moss, charSpacing: 2 });
});

// =====================================================================
// SLIDE 14 — LOJA 15
// =====================================================================
s = pres.addSlide();
bg(s, C.ink);
rail(s);
sectionTag(s, "05", "Loja 15 · Polo de Saúde Clínica");

// Left: info loja
s.addText("15", { x: M, y: 1.3, w: 5, h: 3.0,
  fontFace: F.serif, fontSize: 180, color: C.copper, charSpacing: -8, valign: "top", wrap: false });
s.addText("Polo de Saúde Clínica", { x: M, y: 4.3, w: 5.0, h: 0.5,
  fontFace: F.serif, fontSize: 22, color: C.paper, italic: true });
s.addText("RUA HENRIQUE BADARÓ PORTUGAL, 405\nPORTOFINO STREET MALL · BURITIS · BH", {
  x: M, y: 4.85, w: 5, h: 0.6,
  fontFace: F.mono, fontSize: 9, color: C.olive, charSpacing: 2, lineSpacingMultiple: 1.5 });

s.addShape("line", { x: M, y: 5.55, w: 5, h: 0, line: { color: "404840", width: 0.5 } });
s.addText([
  { text: "VIZINHO 435  ", options: { color: C.olive, fontFace: F.mono, fontSize: 7, charSpacing: 2 } },
  { text: "Oro Odontologia\n", options: { color: C.paper, fontFace: F.serif, fontSize: 12 } },
  { text: "VIZINHO 480  ", options: { color: C.olive, fontFace: F.mono, fontSize: 7, charSpacing: 2 } },
  { text: "Odonto Biológica + Spa Paula Asevedo\n", options: { color: C.paper, fontFace: F.serif, fontSize: 11.5 } },
  { text: "VIZINHO 395  ", options: { color: C.olive, fontFace: F.mono, fontSize: 7, charSpacing: 2 } },
  { text: "Capilar TURBO10", options: { color: C.paper, fontFace: F.serif, fontSize: 12 } },
], { x: M, y: 5.7, w: 4.4, h: 1.7, lineSpacingMultiple: 1.5 });

// Right: target list
const tx_ = M + 5.4, ty_ = 1.5;
s.addShape("rect", { x: tx_ - 0.3, y: ty_ - 0.2, w: 6.6, h: 0.5, fill: { color: C.bg2 }, line: { color: C.copper, width: 0 } });
s.addShape("rect", { x: tx_ - 0.3, y: ty_ - 0.2, w: 0.06, h: 0.5, fill: { color: C.copper }, line: { color: C.copper, width: 0 } });
s.addText("VOCAÇÃO: Loja é o terceiro nó do corredor de saúde — clínica médica, fisio premium ou multi-especialidade boutique.", {
  x: tx_ - 0.1, y: ty_ - 0.2, w: 7.0, h: 0.5,
  fontFace: F.serif, fontSize: 12, color: C.paper, italic: true, valign: "middle" });

const targets16 = [
  ["Médico generalista buscando marca própria", "10+", "concorrentes em salas", "10+ clínicos gerais e dezenas de especialistas em salas. Loja térrea vira referência."],
  ["Clínica de fisioterapia premium", "10+", "fisios em prédios", "10+ clínicas em formato sala. Primeira fisio em loja térrea no eixo HBP captura imagem premium."],
  ["Odontologia premium / boutique", "30+", "dentistas no bairro", "Entre 2 odontos vizinhas, diferenciação com sedação, harmonização ou estética bucal alto padrão."],
  ["Centro multi-especialidade boutique", "6-10", "multis estabelecidas", "Sociedade de 3-5 profissionais (médico+fisio+nutri+psi) abrindo clínica integrada."],
  ["Diagnóstico por imagem", "1-2", "unidades de imagem", "Apenas 1-2 unidades de imagem no bairro. Vitrine para venda de exames é estratégica."],
];
targets16.forEach((t, i) => {
  const y_ = ty_ + 0.5 + i * 0.92;
  s.addShape("rect", { x: tx_ - 0.3, y: y_, w: 6.6, h: 0.85, fill: { color: C.bg2 }, line: { color: "262d28", width: 0.5 } });
  s.addText(t[0], { x: tx_ - 0.1, y: y_ + 0.05, w: 4.5, h: 0.35,
    fontFace: F.serif, fontSize: 12, color: C.paper, bold: true });
  s.addText(t[3], { x: tx_ - 0.1, y: y_ + 0.4, w: 4.5, h: 0.42,
    fontFace: F.sans, fontSize: 9, color: "9a948a", valign: "top" });
  s.addText(t[1], { x: tx_ + 5.0, y: y_ + 0.1, w: 1.9, h: 0.45,
    fontFace: F.serif, fontSize: 24, color: C.olive, align: "right", bold: false });
  s.addText(t[2].toUpperCase(), { x: tx_ + 5.0, y: y_ + 0.55, w: 1.9, h: 0.2,
    fontFace: F.mono, fontSize: 6.5, color: C.copperSoft, align: "right", charSpacing: 2 });
});

// =====================================================================
// SLIDE 15 — LOJA 16
// =====================================================================
s = pres.addSlide();
bg(s, C.ink);
rail(s);
sectionTag(s, "05", "Loja 16 · Wellness & Cuidado Premium");

s.addText("16", { x: M, y: 1.3, w: 5, h: 3.0,
  fontFace: F.serif, fontSize: 180, color: C.copper, charSpacing: -8, valign: "top", wrap: false });
s.addText("Wellness & Cuidado Premium", { x: M, y: 4.3, w: 5.0, h: 0.5,
  fontFace: F.serif, fontSize: 22, color: C.paper, italic: true });
s.addText("RUA HENRIQUE BADARÓ PORTUGAL, 411\nPORTOFINO STREET MALL · BURITIS · BH", {
  x: M, y: 4.85, w: 5, h: 0.6,
  fontFace: F.mono, fontSize: 9, color: C.olive, charSpacing: 2, lineSpacingMultiple: 1.5 });

s.addShape("line", { x: M, y: 5.55, w: 5, h: 0, line: { color: "404840", width: 0.5 } });
s.addText([
  { text: "VIZINHO 429  ", options: { color: C.olive, fontFace: F.mono, fontSize: 7, charSpacing: 2 } },
  { text: "GLAMGLOW Nails\n", options: { color: C.paper, fontFace: F.serif, fontSize: 13 } },
  { text: "VIZINHO 435  ", options: { color: C.olive, fontFace: F.mono, fontSize: 7, charSpacing: 2 } },
  { text: "MY JOY Kids\n", options: { color: C.paper, fontFace: F.serif, fontSize: 13 } },
  { text: "VIZINHO 441  ", options: { color: C.olive, fontFace: F.mono, fontSize: 7, charSpacing: 2 } },
  { text: "BasicoKids\n", options: { color: C.paper, fontFace: F.serif, fontSize: 13 } },
  { text: "VIZINHOS 449/455  ", options: { color: C.olive, fontFace: F.mono, fontSize: 7, charSpacing: 2 } },
  { text: "Pink Me Up + Esmalteria", options: { color: C.paper, fontFace: F.serif, fontSize: 13 } },
], { x: M, y: 5.7, w: 5, h: 1.7, lineSpacingMultiple: 1.4 });

const tx2 = M + 5.7, ty2 = 1.5;
s.addShape("rect", { x: tx2 - 0.3, y: ty2 - 0.2, w: 6.6, h: 0.5, fill: { color: C.bg2 }, line: { color: C.copper, width: 0 } });
s.addShape("rect", { x: tx2 - 0.3, y: ty2 - 0.2, w: 0.06, h: 0.5, fill: { color: C.copper }, line: { color: C.copper, width: 0 } });
s.addText("VOCAÇÃO: Loja é o cuidado profundo entre o cuidado leve — pega a mesma cliente das esmalterias e oferece um nível acima.", {
  x: tx2 - 0.1, y: ty2 - 0.2, w: 7.0, h: 0.5,
  fontFace: F.serif, fontSize: 12, color: C.paper, italic: true, valign: "middle" });

const targets17 = [
  ["Spa premium / Day Spa sensorial", "6-10", "spas em outros formatos", "6-10 spas/massagens em sala. Spa premium com ritual completo + mensalidade ocupa o topo."],
  ["Clínica de estética avançada premium", "10+", "estéticas em salas", "10+ clínicas em salas comerciais. Fachada premium muda posicionamento e atrai cliente A."],
  ["Centro de recovery dedicado", "1-2", "unidades de recovery", "1-2 players de crio/pressoterapia. Vitrine vira destino dos 5+ crossfits do bairro."],
  ["Clínica de tricologia / saúde capilar", "3-5", "players capilares", "Capilar TURBO10 está no nº 395 — sinergia vs competição direta."],
  ["Pediatria + desenvolvimento infantil premium", "6-10", "pediatras", "Vizinhos diretos são lojas infantis. Mesma família. Pediatria + fono + psicopedagogia."],
];
targets17.forEach((t, i) => {
  const y_ = ty2 + 0.5 + i * 0.92;
  s.addShape("rect", { x: tx2 - 0.3, y: y_, w: 6.6, h: 0.85, fill: { color: C.bg2 }, line: { color: "262d28", width: 0.5 } });
  s.addText(t[0], { x: tx2 - 0.1, y: y_ + 0.05, w: 4.5, h: 0.35,
    fontFace: F.serif, fontSize: 12, color: C.paper, bold: true });
  s.addText(t[3], { x: tx2 - 0.1, y: y_ + 0.4, w: 4.5, h: 0.42,
    fontFace: F.sans, fontSize: 9, color: "9a948a", valign: "top" });
  s.addText(t[1], { x: tx2 + 5.0, y: y_ + 0.1, w: 1.9, h: 0.45,
    fontFace: F.serif, fontSize: 24, color: C.olive, align: "right" });
  s.addText(t[2].toUpperCase(), { x: tx2 + 5.0, y: y_ + 0.55, w: 1.9, h: 0.2,
    fontFace: F.mono, fontSize: 6.5, color: C.copperSoft, align: "right", charSpacing: 2 });
});

// =====================================================================
// SLIDE 16 — METODOLOGIA
// =====================================================================
s = pres.addSlide();
bg(s, C.paper);
rail(s, false);
sectionTag(s, "06", "Metodologia", false);

s.addText("Como chegamos aqui.", {
  x: M, y: 1.3, w: 12, h: 0.7, fontFace: F.serif, fontSize: 36, color: C.ink, italic: true, charSpacing: -1 });

const etapas = [
  { e: "ETAPA 01", t: "Base populacional", d: "IBGE Censo 2022, Prefeitura BH, Atlas Brasil PNUD, relatórios imobiliários 2025 (QuintoAndar, Portas, Diário do Comércio)." },
  { e: "ETAPA 02", t: "Pesquisa Google Maps", d: "Cada modalidade verificada por busca direta (mai/2026) + Buritis Juntos + ABB + Doctoralia + Apontador + sites próprios. 40+ queries diferentes." },
  { e: "ETAPA 03", t: "Cruzamento com setor", d: "Cruzamento com CFM/CRM-MG, CREFITO-4, COFFITO, CRP-04, CRO-MG e tendências macro Sebrae, ANS, OMS, Ipsos." },
  { e: "ETAPA 04", t: "Validação in loco", d: "Verificação adicional via screenshots de Google Maps fornecidos pelo cliente, ajustando contagens reais e removendo categorias com gap aparente que se mostraram saturadas." },
];

const ex0 = M, ey0 = 2.4, ew = 3.0, eh = 3.5, egap = 0.13;
etapas.forEach((it, i) => {
  const x = ex0 + i * (ew + egap);
  // Número grande discreto no canto em vez de linha decorativa
  s.addText("0" + (i + 1), { x, y: ey0 - 0.1, w: 1.5, h: 0.6,
    fontFace: F.serif, fontSize: 40, color: "e8e0d0", italic: true });
  s.addText(it.e, { x, y: ey0 + 0.5, w: ew, h: 0.22,
    fontFace: F.mono, fontSize: 7, color: C.moss, charSpacing: 3 });
  s.addText(it.t, { x, y: ey0 + 0.85, w: ew - 0.1, h: 0.85,
    fontFace: F.serif, fontSize: 22, color: C.ink, italic: true, charSpacing: -1, lineSpacingMultiple: 1.1 });
  s.addText(it.d, { x, y: ey0 + 1.85, w: ew - 0.1, h: 2.0,
    fontFace: F.sans, fontSize: 11, color: "3a3a35", valign: "top", lineSpacingMultiple: 1.4 });
});

s.addShape("rect", { x: M, y: 6.3, w: W - 2 * M - 0.6, h: 0.75, fill: { color: C.paper2 }, line: { color: C.olive, width: 0 } });
s.addShape("rect", { x: M, y: 6.3, w: 0.06, h: 0.75, fill: { color: C.olive }, line: { color: C.olive, width: 0 } });
s.addText("NOTA SOBRE FAIXAS  ·  Contagens são faixas aproximadas. Players ativos contados quando apareceram em 2+ fontes (Google Maps + Buritis Juntos/ABB/Doctoralia/site próprio). Profissionais individuais autônomos não foram somados. Foco é dar magnitude correta da oferta — não censo exato.", {
  x: M + 0.5, y: 6.4, w: W - 2 * M - 0.9, h: 0.6,
  fontFace: F.serif, fontSize: 10.5, color: C.inkSoft, italic: false, valign: "middle" });

// =====================================================================
// SLIDE 17 — FONTES
// =====================================================================
s = pres.addSlide();
bg(s, C.paper);
rail(s, false);
sectionTag(s, "07", "Fontes", false);

s.addText("Bibliografia.", {
  x: M, y: 1.3, w: 12, h: 0.7, fontFace: F.serif, fontSize: 36, color: C.ink, italic: true, charSpacing: -1 });

s.addText("Toda contagem citada tem fonte clicável. Auditoria é bem-vinda — pesquisa séria precisa ser verificável.", {
  x: M, y: 2.0, w: 12, h: 0.4, fontFace: F.serif, fontSize: 13, color: "555550" });

// 2 colunas
const sources = [
  { ref: "[01]", title: "IBGE Censo Demográfico 2022", desc: "Dados populacionais e domiciliares por bairro de BH", url: "cidades.ibge.gov.br" },
  { ref: "[02]", title: "QuintoAndar · Bairro mais procurado de BH 2025", desc: "Buritis lidera demanda de moradia", url: "quintoandar.com.br" },
  { ref: "[03]", title: "Portas · Inteligência Imobiliária 2025", desc: "Valor médio do m² · R$ 8.956", url: "portas.com.br" },
  { ref: "[04]", title: "Diário do Comércio · Valorização 2025", desc: "+32% no m² do Buritis em 2025", url: "diariodocomercio.com.br" },
  { ref: "[06]", title: "ANS · 53,2 milhões beneficiários · dez/2025", desc: "Saúde suplementar Brasil", url: "gov.br/ans" },
  { ref: "[07]", title: "Brazil Health / Doctoralia · Saúde mental 2025", desc: "+18,5% consultas psi/psiquiatria", url: "brazilhealth.com" },
  { ref: "[08]", title: "Sebrae · Beleza R$ 242 bi 2025", desc: "27 negócios/hora abertos no Brasil", url: "agenciasebrae.com.br" },
  { ref: "[09]", title: "COFFITO / Global Growth Insights", desc: "CAGR 13,8% até 2031 · Fisioterapia", url: "globalgrowthinsights.com" },
  { ref: "[10]", title: "OMS · Estratégia Medicina Integrativa 2025-2034", desc: "76% usam práticas integrativas", url: "who.int" },
  { ref: "[11]", title: "Ipsos via Hospital Sírio-Libanês", desc: "64% mudaram hábitos preventivos", url: "hospitalsiriolibanes.org.br" },
  { ref: "[12]", title: "CRM-MG · Demografia Médica 2024", desc: "17.906 médicos em BH", url: "crmmg.org.br" },
  { ref: "[M1]", title: "Buritis Juntos · Guias por categoria", desc: "Clínica médica, psicologia, crossfit, yoga, pilates, dentista, fisio, vet", url: "buritisjuntos.com.br" },
  { ref: "[M2]", title: "Associação Bairro Buritis", desc: "Guia Bairro Buritis · diretório por categoria", url: "associacaobairroburitis.com.br" },
  { ref: "[M3]", title: "Doctoralia · diretório Buritis", desc: "Profissionais cadastrados com endereço e CRM", url: "doctoralia.com.br/buritis" },
  { ref: "[M11]", title: "Validação in loco Google Maps mai/2026", desc: "Screenshots arquivados de fisio, crossfit, spa, recovery, fono, geriatria, tricologia, longevidade, saúde mental", url: "Google Maps" },
  { ref: "[M12]", title: "Pesquisa de campo v3 (mai/2025)", desc: "Mapeamento presencial raio 1km HBP 405/411", url: "documento interno" },
];

const sw_ = 5.85, sh_ = 0.55;
sources.forEach((it, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = M + col * (sw_ + 0.2);
  const y = 2.55 + row * sh_;
  s.addText(it.ref, { x, y, w: 0.55, h: sh_,
    fontFace: F.mono, fontSize: 8.5, color: C.copper, valign: "top", bold: true, wrap: false });
  s.addText([
    { text: it.title + "\n", options: { color: C.ink, fontFace: F.serif, fontSize: 10, bold: true } },
    { text: it.desc + " - ", options: { color: "555550", fontFace: F.sans, fontSize: 8 } },
    { text: it.url, options: { color: C.moss, fontFace: F.mono, fontSize: 7.5 } },
  ], { x: x + 0.6, y, w: sw_ - 0.65, h: sh_, valign: "top", lineSpacingMultiple: 1.1 });
});

// =====================================================================
// SLIDE 18 — FECHAMENTO
// =====================================================================
s = pres.addSlide();
bg(s, C.ink);
rail(s);

s.addText([
  { text: "Oliveira\n", options: { color: C.paper } },
  { text: "Imóveis", options: { color: C.olive, italic: true } },
], { x: M + 0.5, y: 1.4, w: 7, h: 3,
  fontFace: F.serif, fontSize: 96, color: C.paper, charSpacing: -3, lineSpacingMultiple: 0.95 });

s.addText("Inteligência comercial para quem decide com base em dados verificáveis, não em achismo.", {
  x: M + 0.5, y: 4.5, w: 8, h: 1,
  fontFace: F.serif, fontSize: 22, color: C.olive, italic: true, lineSpacingMultiple: 1.3 });

// Meta block right
s.addText([
  { text: "DOCUMENTO  ", options: { color: C.olive, fontFace: F.mono, fontSize: 8, charSpacing: 2 } },
  { text: "Análise de Mercado · v5\n", options: { color: C.paper, fontFace: F.sans, fontSize: 11 } },
  { text: "TESE  ", options: { color: C.olive, fontFace: F.mono, fontSize: 8, charSpacing: 2 } },
  { text: "Polo maduro + upgrade premium\n", options: { color: C.paper, fontFace: F.sans, fontSize: 11 } },
  { text: "LOJAS  ", options: { color: C.olive, fontFace: F.mono, fontSize: 8, charSpacing: 2 } },
  { text: "16 (HBP 405) & 17 (HBP 411)\n", options: { color: C.paper, fontFace: F.sans, fontSize: 11 } },
  { text: "MALL  ", options: { color: C.olive, fontFace: F.mono, fontSize: 8, charSpacing: 2 } },
  { text: "Portofino Street Mall · Buritis · BH\n", options: { color: C.paper, fontFace: F.sans, fontSize: 11 } },
  { text: "SITE  ", options: { color: C.olive, fontFace: F.mono, fontSize: 8, charSpacing: 2 } },
  { text: "oliveiraimoveis.ia.br\n", options: { color: C.paper, fontFace: F.sans, fontSize: 11 } },
  { text: "FECHAMENTO  ", options: { color: C.olive, fontFace: F.mono, fontSize: 8, charSpacing: 2 } },
  { text: "24 de maio de 2026", options: { color: C.paper, fontFace: F.sans, fontSize: 11 } },
], { x: 8.5, y: 1.5, w: 4.5, h: 4, valign: "top", lineSpacingMultiple: 2.2 });

s.addShape("line", { x: M + 0.5, y: 6.8, w: W - M * 2 - 1, h: 0, line: { color: "404840", width: 0.5 } });
s.addText("© OLIVEIRA IMÓVEIS · INTELIGÊNCIA COMERCIAL", { x: M + 0.5, y: 6.95, w: 6, h: 0.3,
  fontFace: F.mono, fontSize: 8, color: "808066", charSpacing: 3 });
s.addText("40 MODALIDADES · 12 FONTES OFICIAIS · GOOGLE MAPS VERIFICADO", {
  x: 7, y: 6.95, w: 6, h: 0.3, fontFace: F.mono, fontSize: 8, color: "808066", charSpacing: 3, align: "right" });

// ============ SAVE ============
pres.writeFile({ fileName: "Buritis_Saude_Wellness_v5.pptx" }).then(f => {
  console.log("Saved:", f);
});
