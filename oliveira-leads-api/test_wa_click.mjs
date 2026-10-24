#!/usr/bin/env node
/**
 * Testa os endereços /wa-click e /wa-click/casar do worker (clique no botão de WhatsApp da LP Proprietários 360),
 * com um KV falso em memória. Nada sai para a internet.
 * Uso: node oliveira-leads-api/test_wa_click.mjs
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert';
import { pathToFileURL } from 'node:url';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'wa-click-'));
const copia = path.join(tmp, 'worker.mjs');
fs.copyFileSync(new URL('./worker.js', import.meta.url), copia);
const worker = (await import(pathToFileURL(copia).href)).default;
const TOKEN = /var N8N_WEBHOOK_TOKEN = "([^"]+)"|const N8N_WEBHOOK_TOKEN = "([^"]+)"/.exec(fs.readFileSync(copia, 'utf8')); // só para o teste autenticar
const tokenOk = TOKEN[1] || TOKEN[2];

function kvFalso() {
  const m = new Map();
  return {
    m,
    async get(k) { return m.has(k) ? m.get(k) : null; },
    async put(k, v) { m.set(k, v); },
    async list({ prefix = '' } = {}) { const keys = [...m.keys()].filter((k) => k.startsWith(prefix)).sort().map((name) => ({ name })); return { keys, list_complete: true }; },
  };
}
const ORIGEM = 'https://www.oliveiraimoveis.ia.br';
let seq = 0;
const clicar = (env, corpo, { origem = ORIGEM, ip = `10.0.${Math.floor(++seq / 250)}.${seq % 250}` } = {}) => worker.fetch(new Request('https://w.test/wa-click', {
  method: 'POST', headers: { 'Content-Type': 'application/json', ...(origem ? { Origin: origem } : {}), 'CF-Connecting-IP': ip }, body: JSON.stringify(corpo) }), env);
const casar = (env, corpo, token = tokenOk) => worker.fetch(new Request('https://w.test/wa-click/casar', {
  method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { 'X-Oliveira-Webhook-Token': token } : {}) }, body: JSON.stringify(corpo) }), env);
const CLIQUE = { pagina_origem: 'oportunidade-proprietarios-360 (www.oliveiraimoveis.ia.br)', lp_variante: '2', utm_campaign: 'prop360', utm_content: 'prop360-placa', ad_id: '120253999', adset_id: '120253888', placement: 'instagram_reels', utm_id: '120253777', utm_term: '120253888' };

let ok = 0; const falhas = [];
const t = async (nome, fn) => { try { await fn(); ok++; } catch (e) { falhas.push(nome + ': ' + (e.message || e)); } };

await t('clique válido grava um registro com os campos do anúncio e a versão, e nada de dado pessoal', async () => {
  const env = { LEADS: kvFalso() };
  const r = await clicar(env, { ...CLIQUE, telefone: '5531999990000', nome: 'Ana' });
  assert.strictEqual(r.status, 200); assert.deepStrictEqual(await r.json(), { ok: true });
  const [chave, valor] = [...env.LEADS.m.entries()][0];
  assert(/^wac:\d{13}:/.test(chave));
  const c = JSON.parse(valor);
  assert.strictEqual(c.ad_id, '120253999'); assert.strictEqual(c.lp_variante, '2'); assert.strictEqual(c.pagina_origem, 'oportunidade-proprietarios-360');
  assert(!('telefone' in c) && !('nome' in c));
});
await t('origem diferente do domínio da Oliveira (ou sem Origin) é recusada e não grava', async () => {
  const env = { LEADS: kvFalso() };
  for (const origem of ['https://outro.site', '']) { const r = await clicar(env, CLIQUE, { origem }); assert.strictEqual(r.status, 403); }
  assert.strictEqual(env.LEADS.m.size, 0);
});
await t('página que não é a da LP de proprietários é recusada', async () => {
  const env = { LEADS: kvFalso() };
  const r = await clicar(env, { ...CLIQUE, pagina_origem: 'imovel/23' }); assert.strictEqual(r.status, 400); assert.strictEqual(env.LEADS.m.size, 0);
});
await t('mesmo IP em menos de 20 s: responde ok mas não grava de novo (protege a cota do KV)', async () => {
  const env = { LEADS: kvFalso() };
  await clicar(env, CLIQUE, { ip: '9.9.9.9' }); const r = await clicar(env, CLIQUE, { ip: '9.9.9.9' });
  assert.strictEqual(r.status, 200); assert.strictEqual((await r.json()).ignorado, 'muitos cliques'); assert.strictEqual(env.LEADS.m.size, 1);
  await clicar(env, CLIQUE, { ip: '8.8.8.8' }); assert.strictEqual(env.LEADS.m.size, 2);
});
await t('corpo gigante ou inválido não derruba: vira clique recusado', async () => {
  const env = { LEADS: kvFalso() };
  const r = await worker.fetch(new Request('https://w.test/wa-click', { method: 'POST', headers: { Origin: ORIGEM }, body: 'x'.repeat(5000) }), env);
  assert.strictEqual(r.status, 400); assert.strictEqual(env.LEADS.m.size, 0);
});
await t('KV falhando: /wa-click responde 200 (a LP não percebe) e registra o erro', async () => {
  const env = { LEADS: { ...kvFalso(), async put(k) { if (k.startsWith('wac:')) throw new Error('limite diário'); } } };
  const r = await clicar(env, CLIQUE, { ip: '7.7.7.7' }); assert.strictEqual(r.status, 200);
});
await t('/wa-click/casar sem o token do n8n: 401', async () => {
  const env = { LEADS: kvFalso() };
  assert.strictEqual((await casar(env, { conversation_id: '1' }, '')).status, 401);
  assert.strictEqual((await casar(env, { conversation_id: '1' }, 'errado')).status, 401);
});
await t('um único clique na janela: casa, devolve o anúncio e marca como usado', async () => {
  const env = { LEADS: kvFalso() };
  await clicar(env, CLIQUE);
  const r = await (await casar(env, { conversation_id: '168', mensagem_em: new Date(Date.now() + 40 * 1000).toISOString(), janela_min: 10 })).json();
  assert.strictEqual(r.match, true); assert.strictEqual(r.candidatos, 1); assert(r.segundos_antes_da_mensagem >= 35 && r.segundos_antes_da_mensagem <= 45, String(r.segundos_antes_da_mensagem));
  assert.deepStrictEqual(Object.keys(r.clique).sort(), ['ad_id', 'adset_id', 'lp_variante', 'pagina_origem', 'placement', 'utm_campaign', 'utm_content', 'utm_id', 'utm_term']);
  assert(!('consumido_por' in r.clique) && !('t' in r.clique));
  assert(/consumido_por/.test([...env.LEADS.m.values()][0]));
});
await t('retry da mesma conversa devolve o mesmo clique; outra conversa não o reaproveita', async () => {
  const env = { LEADS: kvFalso() };
  await clicar(env, CLIQUE); const msg = new Date(Date.now() + 5000).toISOString();
  const a = await (await casar(env, { conversation_id: '168', mensagem_em: msg })).json();
  const b = await (await casar(env, { conversation_id: '168', mensagem_em: msg })).json();
  assert.strictEqual(a.match, true); assert.strictEqual(b.match, true); assert.strictEqual(b.clique.ad_id, a.clique.ad_id);
  const c = await (await casar(env, { conversation_id: '169', mensagem_em: msg })).json();
  assert.deepStrictEqual(c, { match: false, motivo: 'nenhum_clique_na_janela' });
});
await t('dois cliques livres na janela: NÃO adivinha (ambíguo) e não consome nenhum', async () => {
  const env = { LEADS: kvFalso() };
  await clicar(env, CLIQUE); await clicar(env, { ...CLIQUE, ad_id: '555' });
  const r = await (await casar(env, { conversation_id: '170', mensagem_em: new Date(Date.now() + 5000).toISOString() })).json();
  assert.deepStrictEqual(r, { match: false, motivo: 'ambiguo', candidatos: 2 });
  assert(![...env.LEADS.m.values()].some((v) => /consumido_por/.test(v)));
});
await t('clique antigo (fora da janela) ou depois da mensagem não casa; janela padrão 10 min e máxima 60', async () => {
  const env = { LEADS: kvFalso() };
  env.LEADS.m.set(`wac:${String(Date.now() - 15 * 60 * 1000).padStart(13, '0')}:aaaaaa`, JSON.stringify({ ad_id: 'velho', pagina_origem: 'oportunidade-proprietarios-360' }));
  const agora = new Date().toISOString();
  assert.strictEqual((await (await casar(env, { conversation_id: '1', mensagem_em: agora })).json()).motivo, 'nenhum_clique_na_janela');            // 15 min > 10 min
  assert.strictEqual((await (await casar(env, { conversation_id: '1', mensagem_em: agora, janela_min: 999 })).json()).match, true);                  // teto 60 min pega o de 15
  env.LEADS.m.set(`wac:${String(Date.now() + 5 * 60 * 1000).padStart(13, '0')}:bbbbbb`, JSON.stringify({ ad_id: 'futuro' }));
  const r = await (await casar(env, { conversation_id: '2', mensagem_em: agora, janela_min: 5 })).json();
  assert.strictEqual(r.match, false);                                                                                                              // clique 5 min DEPOIS da mensagem não vale
});
await t('sem clique algum: nenhum_clique_na_janela', async () => {
  const env = { LEADS: kvFalso() };
  assert.deepStrictEqual(await (await casar(env, { conversation_id: '1', mensagem_em: new Date().toISOString() })).json(), { match: false, motivo: 'nenhum_clique_na_janela' });
});
await t('as outras rotas continuam: /lead sem dados responde 400, GET /leads sem senha 401, rota solta 404', async () => {
  const env = { LEADS: kvFalso() };
  assert.strictEqual((await worker.fetch(new Request('https://w.test/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }), env)).status, 400);
  assert.strictEqual((await worker.fetch(new Request('https://w.test/leads'), env)).status, 401);
  assert.strictEqual((await worker.fetch(new Request('https://w.test/nada'), env)).status, 404);
});

fs.rmSync(tmp, { recursive: true, force: true });
if (falhas.length) { console.error('FALHAS:\n - ' + falhas.join('\n - ')); console.error(`${ok} ok, ${falhas.length} falhas`); process.exit(1); }
console.log(`${ok} ok`);
