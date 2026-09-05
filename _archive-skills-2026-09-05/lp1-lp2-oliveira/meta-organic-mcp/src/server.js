#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

const PAGE_ID = process.env.META_PAGE_ID || "675648152299381";
const PAGE_TOKEN = process.env.META_PAGE_ACCESS_TOKEN;
const GRAPH_VERSION = "v19.0";
const BASE = `https://graph.facebook.com/${GRAPH_VERSION}`;

let igAccountId = process.env.META_IG_ACCOUNT_ID || null;

function requireToken() {
  if (!PAGE_TOKEN) {
    throw new McpError(
      ErrorCode.InvalidRequest,
      "META_PAGE_ACCESS_TOKEN não configurado. Rode: node src/server.js --setup para instruções."
    );
  }
}

async function graphGet(path, params = {}) {
  requireToken();
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("access_token", PAGE_TOKEN);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  }
  const res = await fetch(url.toString());
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new McpError(
      ErrorCode.InvalidRequest,
      `Graph API erro: ${data.error?.message || res.statusText} (code ${data.error?.code})`
    );
  }
  return data;
}

async function getIgAccountId() {
  if (igAccountId) return igAccountId;
  const data = await graphGet(`/${PAGE_ID}`, { fields: "instagram_business_account" });
  igAccountId = data.instagram_business_account?.id;
  if (!igAccountId) {
    throw new McpError(
      ErrorCode.InvalidRequest,
      `Página ${PAGE_ID} não tem Instagram Business Account vinculado. Conecte o perfil IG no Facebook Business Manager.`
    );
  }
  return igAccountId;
}

function parsePeriod(period) {
  if (!period) return {};
  const now = Math.floor(Date.now() / 1000);
  const map = {
    "7d": { since: now - 7 * 86400, until: now },
    "14d": { since: now - 14 * 86400, until: now },
    "30d": { since: now - 30 * 86400, until: now },
    "yesterday": { since: now - 2 * 86400, until: now - 86400 },
    "today": { since: now - 86400, until: now },
  };
  return map[period] || {};
}

// --- Tools ---

async function igAccountInsights({ period = "30d", breakdown }) {
  // A Graph API descontinuou "impressions" no nível de conta e passou a exigir
  // metric_type=total_value (sem série diária) para profile_views/accounts_engaged/
  // total_interactions/website_clicks — período=day com esses nomes dá erro #100.
  // "reach" e "follower_count" continuam funcionando como série diária normal.
  const igId = await getIgAccountId();
  const { since, until } = parsePeriod(period);

  const timeseriesParams = {
    metric: ["reach", "follower_count"].join(","),
    period: "day",
    since,
    until,
  };
  if (breakdown) timeseriesParams.breakdown = breakdown;

  const [timeseries, totals] = await Promise.all([
    graphGet(`/${igId}/insights`, timeseriesParams),
    graphGet(`/${igId}/insights`, {
      metric: [
        "profile_views",
        "accounts_engaged",
        "total_interactions",
        "website_clicks",
      ].join(","),
      period: "day",
      metric_type: "total_value",
      since,
      until,
    }),
  ]);

  return { data: [...(timeseries.data || []), ...(totals.data || [])] };
}

async function igPostsPerformance({ limit = 25, media_type, since_days = 30 }) {
  const igId = await getIgAccountId();
  const fields = [
    "id",
    "caption",
    "media_type",
    "timestamp",
    "permalink",
    "like_count",
    "comments_count",
    "shares_count",
    // "impressions"/"video_views"/"plays" foram descontinuados pela Graph API — "views"
    // é o substituto unificado (cobre plays de reel e video views de feed).
    "insights.metric(reach,saved,views,ig_reels_avg_watch_time,ig_reels_video_view_total_time,total_interactions){values}",
  ].join(",");

  const since = Math.floor(Date.now() / 1000) - since_days * 86400;
  const params = { fields, limit };

  const data = await graphGet(`/${igId}/media`, params);
  let items = data.data || [];

  if (media_type) {
    items = items.filter((m) => m.media_type === media_type.toUpperCase());
  }

  items = items.filter((m) => {
    const ts = new Date(m.timestamp).getTime() / 1000;
    return ts >= since;
  });

  return { posts: items, count: items.length };
}

async function igReelsInsights({ limit = 20, since_days = 30 }) {
  const igId = await getIgAccountId();
  const fields = [
    "id",
    "caption",
    "timestamp",
    "permalink",
    "like_count",
    "comments_count",
    // "plays"/"impressions" descontinuados — "views" é o substituto de "plays".
    "insights.metric(views,reach,ig_reels_avg_watch_time,ig_reels_video_view_total_time,saved,shares,total_interactions){values}",
  ].join(",");

  const since = Math.floor(Date.now() / 1000) - since_days * 86400;
  const data = await graphGet(`/${igId}/media`, {
    fields,
    limit,
    // filter reels server-side when possible
  });

  const reels = (data.data || []).filter((m) => {
    const isReel = m.media_type === "VIDEO" || m.product_type === "REELS";
    const ts = new Date(m.timestamp).getTime() / 1000;
    return isReel && ts >= since;
  });

  const processed = reels.map((r) => {
    const ins = {};
    (r.insights?.data || []).forEach((metric) => {
      const val = metric.values?.[0]?.value;
      ins[metric.name] = typeof val === "object" ? val : Number(val) || 0;
    });
    const avgWatch = ins.ig_reels_avg_watch_time
      ? (ins.ig_reels_avg_watch_time / 1000).toFixed(1) + "s"
      : null;
    return {
      id: r.id,
      caption: (r.caption || "").slice(0, 100),
      timestamp: r.timestamp,
      permalink: r.permalink,
      likes: r.like_count,
      comments: r.comments_count,
      views: ins.views || 0,
      reach: ins.reach || 0,
      avg_watch_time_seconds: ins.ig_reels_avg_watch_time
        ? ins.ig_reels_avg_watch_time / 1000
        : null,
      avg_watch_time: avgWatch,
      total_watch_minutes: ins.ig_reels_video_view_total_time
        ? (ins.ig_reels_video_view_total_time / 60000).toFixed(1)
        : null,
      saves: ins.saved || 0,
      shares: ins.shares || 0,
      total_interactions: ins.total_interactions || 0,
    };
  });

  processed.sort((a, b) => b.views - a.views);
  return { reels: processed, count: processed.length };
}

async function igStoriesInsights({ limit = 50 }) {
  const igId = await getIgAccountId();
  const fields = [
    "id",
    "caption",
    "media_type",
    "timestamp",
    "permalink",
    // "impressions"/"exits"/"taps_forward"/"taps_back" descontinuados — "navigation"
    // com breakdown por story_navigation_action_type substitui os três últimos.
    "insights.metric(reach,navigation,replies).breakdown(story_navigation_action_type){values}",
  ].join(",");

  const data = await graphGet(`/${igId}/stories`, { fields, limit });
  const stories = (data.data || []).map((s) => {
    const ins = { reach: 0, replies: 0 };
    const nav = { tap_forward: 0, tap_back: 0, tap_exit: 0, swipe_forward: 0 };
    (s.insights?.data || []).forEach((m) => {
      if (m.name === "navigation") {
        (m.total_value?.breakdowns?.[0]?.results || []).forEach((r) => {
          const key = r.dimension_values?.[0];
          if (key) nav[key] = (r.value || 0) + (nav[key] || 0);
        });
      } else {
        ins[m.name] = m.values?.[0]?.value ?? m.total_value?.value ?? 0;
      }
    });
    const exits = nav.tap_exit || 0;
    return {
      id: s.id,
      caption: (s.caption || "").slice(0, 80),
      media_type: s.media_type,
      timestamp: s.timestamp,
      reach: ins.reach || 0,
      replies: ins.replies || 0,
      taps_forward: (nav.tap_forward || 0) + (nav.swipe_forward || 0),
      taps_back: nav.tap_back || 0,
      exits,
      completion_rate: ins.reach
        ? (((ins.reach - exits) / ins.reach) * 100).toFixed(1) + "%"
        : null,
    };
  });

  return { stories, count: stories.length };
}

async function igAudienceInsights() {
  // "audience_city"/"audience_country"/"audience_gender_age" foram descontinuados —
  // vira "follower_demographics" (metric_type=total_value) com um breakdown por chamada.
  // Contas com <100 seguidores costumam voltar {"data":[]} silencioso (limite da API,
  // não ausência de audiência).
  const igId = await getIgAccountId();

  const breakdowns = ["city", "country", "age,gender"];
  const [city, country, ageGender, online] = await Promise.all([
    ...breakdowns.map((breakdown) =>
      graphGet(`/${igId}/insights`, {
        metric: "follower_demographics",
        period: "lifetime",
        metric_type: "total_value",
        breakdown,
      })
    ),
    graphGet(`/${igId}/insights`, {
      metric: "online_followers",
      period: "lifetime",
    }),
  ]);

  return {
    follower_demographics_city: city,
    follower_demographics_country: country,
    follower_demographics_age_gender: ageGender,
    online_followers: online,
  };
}

// --- Schema ---

const tools = [
  {
    name: "ig_account_insights",
    description:
      "Métricas da conta orgânica do Instagram: reach, impressions, profile views, contas engajadas, interações totais e follower count. Período: 7d, 14d, 30d, yesterday.",
    inputSchema: {
      type: "object",
      properties: {
        period: {
          type: "string",
          enum: ["7d", "14d", "30d", "yesterday", "today"],
          description: "Período de análise.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "ig_posts_performance",
    description:
      "Performance dos posts do feed: curtidas, comentários, alcance, impressões, saves e views por post. Filtra por tipo (IMAGE, VIDEO, CAROUSEL_ALBUM).",
    inputSchema: {
      type: "object",
      properties: {
        since_days: {
          type: "integer",
          minimum: 1,
          maximum: 90,
          description: "Quantos dias para trás analisar. Padrão: 30.",
        },
        media_type: {
          type: "string",
          enum: ["IMAGE", "VIDEO", "CAROUSEL_ALBUM"],
          description: "Filtrar por tipo de mídia (opcional).",
        },
        limit: {
          type: "integer",
          minimum: 1,
          maximum: 100,
          description: "Máximo de posts. Padrão: 25.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "ig_reels_insights",
    description:
      "Análise de Reels orgânicos: plays, reach, tempo médio assistido (ig_reels_avg_watch_time), tempo total, saves, shares. Ordenado por plays.",
    inputSchema: {
      type: "object",
      properties: {
        since_days: {
          type: "integer",
          minimum: 1,
          maximum: 90,
          description: "Quantos dias para trás analisar. Padrão: 30.",
        },
        limit: {
          type: "integer",
          minimum: 1,
          maximum: 50,
          description: "Máximo de reels. Padrão: 20.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "ig_stories_insights",
    description:
      "Insights dos Stories ativos (últimas 24h): impressões, reach, exits, replies, taps forward/back e taxa de conclusão.",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "integer",
          minimum: 1,
          maximum: 100,
          description: "Máximo de stories. Padrão: 50.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "ig_audience_insights",
    description:
      "Dados demográficos da audiência: cidade, país, gênero/faixa etária e seguidores online por horário.",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
];

const server = new Server(
  { name: "oliveira-meta-organic-mcp", version: "0.1.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    let result;
    if (name === "ig_account_insights") {
      const input = z.object({ period: z.string().optional() }).parse(args || {});
      result = await igAccountInsights(input);
    } else if (name === "ig_posts_performance") {
      const input = z
        .object({
          since_days: z.number().int().min(1).max(90).default(30),
          media_type: z.string().optional(),
          limit: z.number().int().min(1).max(100).default(25),
        })
        .parse(args || {});
      result = await igPostsPerformance(input);
    } else if (name === "ig_reels_insights") {
      const input = z
        .object({
          since_days: z.number().int().min(1).max(90).default(30),
          limit: z.number().int().min(1).max(50).default(20),
        })
        .parse(args || {});
      result = await igReelsInsights(input);
    } else if (name === "ig_stories_insights") {
      const input = z.object({ limit: z.number().int().min(1).max(100).default(50) }).parse(args || {});
      result = await igStoriesInsights(input);
    } else if (name === "ig_audience_insights") {
      result = await igAudienceInsights();
    } else {
      throw new McpError(ErrorCode.MethodNotFound, `Ferramenta desconhecida: ${name}`);
    }
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  } catch (error) {
    if (error instanceof McpError) throw error;
    if (error instanceof z.ZodError) {
      throw new McpError(ErrorCode.InvalidParams, error.message);
    }
    throw new McpError(ErrorCode.InternalError, error.message || String(error));
  }
});

if (process.argv.includes("--check")) {
  if (!PAGE_TOKEN) {
    console.error("ERRO: META_PAGE_ACCESS_TOKEN não definido.");
    console.error("Veja instrucoes em: ~/.claude/skills/caso-credaluga-palmira/meta-organic-mcp/SETUP.md");
    process.exit(1);
  }
  try {
    const igId = await getIgAccountId();
    console.log("oliveira-meta-organic-mcp OK");
    console.log(`PAGE_ID=${PAGE_ID}`);
    console.log(`IG_ACCOUNT_ID=${igId}`);
  } catch (e) {
    console.error("ERRO:", e.message);
    process.exit(1);
  }
  process.exit(0);
}

const transport = new StdioServerTransport();
await server.connect(transport);
