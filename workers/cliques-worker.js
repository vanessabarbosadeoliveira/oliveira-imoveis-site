/**
 * Worker: cliques.oliveiraimoveis.ia.br
 *
 * KV binding: CLIQUES_KV  (criar no dashboard Cloudflare)
 * Rotas:
 *   GET  /api/cliques  → { count: N }
 *   POST /api/cliques  → incrementa e retorna { count: N+1 }
 *
 * Deploy:
 *   wrangler deploy  (usar wrangler.toml abaixo)
 */

const CORS = {
  'Access-Control-Allow-Origin': 'https://www.oliveiraimoveis.ia.br',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    // Preflight CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url = new URL(request.url);
    if (url.pathname !== '/api/cliques') {
      return new Response('Not found', { status: 404 });
    }

    const key = 'total';

    if (request.method === 'GET') {
      const val = await env.CLIQUES_KV.get(key);
      const count = val ? parseInt(val, 10) : 0;
      return Response.json({ count }, { headers: CORS });
    }

    if (request.method === 'POST') {
      const val = await env.CLIQUES_KV.get(key);
      const count = (val ? parseInt(val, 10) : 0) + 1;
      await env.CLIQUES_KV.put(key, String(count));
      return Response.json({ count }, { headers: CORS });
    }

    return new Response('Method not allowed', { status: 405, headers: CORS });
  },
};
