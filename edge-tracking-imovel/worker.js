// oliveira-edge-tracking-imovel
// Injeta GA4 + PageView do Meta Pixel nas paginas /imovel/* do site (Next.js do Daniel, worker soft-smoke-c987),
// que nao carregam nenhuma das duas tags na abertura. Remendo temporario ate o Daniel colocar no codigo do site.
//
// Regras de seguranca (campanha ativa, nao pode prejudicar):
//  - so reescreve resposta HTML de GET/HEAD com status 200; todo o resto (POST, RSC, API, redirect, erro) passa intacto;
//  - qualquer excecao cai no passThroughOnException (a requisicao segue para o site sem alteracao);
//  - NAO dispara generate_lead nem Lead: o envio do lead continua exclusivamente com o codigo do site + worker oliveira-leads-api;
//  - kill switch: variavel TRACKING_ENABLED = "0" desliga a injecao sem trocar o codigo.

const GA4_ID = "G-4YM3X80NZ8";
const PIXEL_ID = "26815330474775862";

const SNIPPET = `<script data-oi-edge-tracking>(function(){try{
if(window.__oiEdgeTracking)return;window.__oiEdgeTracking=1;
window.dataLayer=window.dataLayer||[];
window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};
window.gtag('js',new Date());window.gtag('config','${GA4_ID}');
var g=document.createElement('script');g.async=true;g.src='https://www.googletagmanager.com/gtag/js?id=${GA4_ID}';document.head.appendChild(g);
if(!window.fbq){!function(f,b,e,v,n,t,s){n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');}
window.fbq('init','${PIXEL_ID}');window.fbq('track','PageView');
}catch(e){}})();</script>`;

const PATH_OK = /^\/imovel\/[^/]+\/?$/;

export default {
  async fetch(request, env, ctx) {
    ctx.passThroughOnException();

    const url = new URL(request.url);
    const upstream = await callSite(request, env, url);

    if (env.TRACKING_ENABLED === "0") return upstream;
    if (request.method !== "GET" && request.method !== "HEAD") return upstream;
    if (!PATH_OK.test(url.pathname)) return upstream;
    if (upstream.status !== 200) return upstream;
    if (!(upstream.headers.get("content-type") || "").includes("text/html")) return upstream;
    // Corpo ainda comprimido: nao da para reescrever com seguranca, devolve a pagina original sem injetar.
    const enc = (upstream.headers.get("content-encoding") || "").toLowerCase();
    if (enc && enc !== "identity") return upstream;

    const headers = new Headers(upstream.headers);
    headers.delete("content-length");
    headers.set("x-oi-edge-tracking", "1");

    return new HTMLRewriter()
      .on("head", {
        element(el) {
          el.append(SNIPPET, { html: true });
        },
      })
      .transform(new Response(upstream.body, { status: upstream.status, statusText: upstream.statusText, headers }));
  },
};

function callSite(request, env, url) {
  // Sem Accept-Encoding o runtime entrega o corpo descomprimido (a borda comprime de novo na saida).
  const headers = new Headers(request.headers);
  headers.delete("accept-encoding");
  request = new Request(request, { headers });

  // Teste local: UPSTREAM_ORIGIN aponta para o site publicado. Em producao, o binding SITE chama o worker soft-smoke-c987 direto.
  if (env.UPSTREAM_ORIGIN) {
    const target = new URL(url.pathname + url.search, env.UPSTREAM_ORIGIN);
    return fetch(new Request(target, request));
  }
  return env.SITE.fetch(request);
}
