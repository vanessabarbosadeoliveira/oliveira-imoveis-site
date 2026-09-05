"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const WHATSAPP_PHONE = "5531999558360";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  segment: "",
  consent: false
};

const LEADS_ENDPOINT = "https://oliveira-leads-api.vanessabarbosadeoliveira9.workers.dev/lead";

function firstParam(params, names, fallback) {
  for (const name of names) {
    const value = params.get(name);
    if (value) return value;
  }

  return fallback;
}

function getUtmData() {
  if (typeof window === "undefined") {
    return {
      source: "sem_origem",
      medium: "sem_midia",
      campaign: "sem_campanha",
      campaignId: "sem_campaign_id",
      adset: "sem_conjunto",
      adsetId: "sem_adset_id",
      ad: "sem_anuncio",
      adId: "sem_ad_id",
      placement: "sem_posicionamento",
      fbclid: "sem_fbclid"
    };
  }

  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get("utm_source") || "sem_origem",
    medium: params.get("utm_medium") || "sem_midia",
    campaign: params.get("utm_campaign") || "sem_campanha",
    campaignId: firstParam(params, ["utm_id", "campaign_id", "meta_campaign_id"], "sem_campaign_id"),
    adset: firstParam(params, ["utm_term", "adset", "adset_name", "meta_adset"], "sem_conjunto"),
    adsetId: firstParam(params, ["adset_id", "utm_adset_id", "meta_adset_id"], "sem_adset_id"),
    ad: firstParam(params, ["utm_content", "ad", "ad_name", "creative", "meta_ad"], "sem_anuncio"),
    adId: firstParam(params, ["ad_id", "utm_ad_id", "creative_id", "meta_ad_id"], "sem_ad_id"),
    placement: firstParam(params, ["placement", "utm_placement", "site_source_name"], "sem_posicionamento"),
    fbclid: params.get("fbclid") || "sem_fbclid"
  };
}

function buildWhatsappUrl(form, utm) {
  const message = [
    "Olá, vim pela landing do Portofino Street Mall e quero solicitar uma análise estratégica.",
    "",
    `Nome: ${form.name}`,
    `E-mail: ${form.email}`,
    `WhatsApp: ${form.phone}`,
    "",
    "Origem do contato:",
    `Campanha: ${utm.campaign}`,
    `ID da campanha: ${utm.campaignId}`,
    `Conjunto de anúncios: ${utm.adset}`,
    `ID do conjunto: ${utm.adsetId}`,
    `Anúncio/criativo: ${utm.ad}`,
    `ID do anúncio: ${utm.adId}`,
    `Posicionamento: ${utm.placement}`,
    `Origem/mídia: ${utm.source} / ${utm.medium}`,
    `Click ID Meta: ${utm.fbclid}`
  ].join("\n");

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

function leadEventParams(utm, label) {
  return {
    event_category: "landing_page",
    event_label: label,
    source: utm.source,
    medium: utm.medium,
    campaign: utm.campaign,
    campaign_id: utm.campaignId,
    adset: utm.adset,
    adset_id: utm.adsetId,
    ad_name: utm.ad,
    ad_id: utm.adId,
    placement: utm.placement,
    fbclid: utm.fbclid,
    lead_channel: "whatsapp",
    landing_page: "portofino_street_mall"
  };
}

export default function LeadFormModal({ isOpen, onClose }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const utm = useMemo(() => getUtmData(), [isOpen]);

  if (!isOpen) return null;

  function updateField(event) {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  function trackLead() {
    // Dispara os beacons de GA4/Meta e só resolve quando o GA4 confirmar o
    // envio do evento generate_lead (via event_callback) — ou depois de
    // 400ms, o que vier primeiro. Isso evita perder o beacon quando o
    // WhatsApp abre logo em seguida: gtag/fbq não têm a mesma proteção de
    // keepalive que o fetch do painel de leads tem, e a troca de contexto
    // (especialmente dentro do navegador in-app do Instagram/Facebook) pode
    // cancelar a requisição de tracking antes dela sair.
    return new Promise((resolve) => {
      let settled = false;
      const settle = () => {
        if (settled) return;
        settled = true;
        resolve();
      };

      if (typeof window !== "undefined" && window.gtag) {
        window.gtag(
          "event",
          "form_submitted",
          leadEventParams(utm, "portofino_street_mall_form")
        );
        window.gtag(
          "event",
          "whatsapp_click",
          leadEventParams(utm, "portofino_street_mall_whatsapp")
        );
        window.gtag("event", "generate_lead", {
          ...leadEventParams(utm, "portofino_street_mall_form"),
          event_callback: settle
        });
      }

      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "Lead", {
          content_name: "Portofino Street Mall",
          content_category: "Lead form to WhatsApp",
          campaign: utm.campaign,
          adset: utm.adset,
          ad_name: utm.ad
        });
      }

      setTimeout(settle, 400);
    });
  }

  async function submitForm(event) {
    event.preventDefault();
    const normalized = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      segment: form.segment.trim()
    };

    if (!normalized.name || !normalized.email || !normalized.phone || !normalized.segment || !normalized.consent) {
      setError("Preencha seus dados e aceite os termos para continuar.");
      return;
    }

    setError("");

    // Captura o lead por e-mail (FormSubmit), igual à LP1 — registra o lead
    // mesmo que o usuário não conclua o envio no WhatsApp. Fire-and-forget,
    // já protegido por keepalive.
    if (typeof window !== "undefined" && typeof fetch === "function") {
      const payload = new FormData();
      payload.append("pagina_origem", "Portofino Street Mall");
      payload.append("pagina_origem", "Portofino Street Mall (lp.oliveiraimoveis.ia.br - Portofino)");
      payload.append("nome", normalized.name);
      payload.append("email", normalized.email);
      payload.append("telefone", normalized.phone);
      payload.append("segmento", normalized.segment);
      payload.append("aceite_termos", normalized.consent ? "Sim" : "Não");
      payload.append("data_aceite", new Date().toLocaleString("pt-BR"));
      payload.append("utm_source", utm.source);
      payload.append("utm_medium", utm.medium);
      payload.append("utm_campaign", utm.campaign);
      payload.append("utm_id", utm.campaignId);
      payload.append("conjunto_anuncios", utm.adset);
      payload.append("adset_id", utm.adsetId);
      payload.append("anuncio", utm.ad);
      payload.append("ad_id", utm.adId);
      payload.append("placement", utm.placement);
      payload.append("fbclid", utm.fbclid);
      fetch(LEADS_ENDPOINT, { method: "POST", body: payload, keepalive: true }).catch(() => {});
    }

    await trackLead();

    window.open(buildWhatsappUrl(normalized, utm), "_blank", "noopener,noreferrer");
    setForm(emptyForm);
    onClose();
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="lead-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-form-title"
      >
        <header className="lead-modal-header">
          <span className="whatsapp-mark" aria-hidden="true">W</span>
          <div>
            <h2 id="lead-form-title">Fale pelo WhatsApp</h2>
            <p>Preencha seus dados e fale conosco agora</p>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Fechar">
            x
          </button>
        </header>

        <form className="lead-form" onSubmit={submitForm}>
          <label className="field">
            <span>Nome completo</span>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={updateField}
              autoComplete="name"
              required
            />
          </label>

          <label className="field">
            <span>E-mail</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              autoComplete="email"
              required
            />
          </label>

          <label className="field">
            <span>WhatsApp</span>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={updateField}
              inputMode="tel"
              autoComplete="tel"
              placeholder="BR +55 (11) 99999-9999"
              required
            />
          </label>

          <label className="field">
            <span>Segmento do seu negócio</span>
            <input
              name="segment"
              type="text"
              value={form.segment}
              onChange={updateField}
              placeholder="Ex: Pilates, estética, psicologia, pet shop..."
              required
            />
          </label>

          <label className="consent">
            <input
              name="consent"
              type="checkbox"
              checked={form.consent}
              onChange={updateField}
              required
            />
            <span>
              Ao continuar, você concorda com os{" "}
              <Link href="/termos-de-uso" target="_blank">Termos de Uso</Link> e{" "}
              <Link href="/politica-de-privacidade" target="_blank">
                Política de Privacidade
              </Link>.
            </span>
          </label>

          {error ? <p className="form-error" role="alert">{error}</p> : null}

          <button className="submit-button" type="submit">
            Enviar
          </button>

          <button className="whatsapp-button" type="submit">
            Fale conosco
          </button>
        </form>
      </section>
    </div>
  );
}
