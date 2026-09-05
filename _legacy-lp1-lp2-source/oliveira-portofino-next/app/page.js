"use client";

import { useState } from "react";
import LeadFormModal from "../components/LeadFormModal";

const details = [
  ["Localização estratégica", "R. Henrique Badaró Portugal, no Buritis"],
  ["Fluxo qualificado", "Visibilidade premium para marcas de saúde"],
  ["Estrutura moderna", "Ambiente sofisticado para atendimento"],
  ["Ideal para clínicas", "Wellness, fisioterapia, psicologia e bem-estar"]
];

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  function openForm() {
    setIsFormOpen(true);
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "form_opened", {
        event_category: "landing_page",
        event_label: "portofino_street_mall_form"
      });
    }
  }

  return (
    <main className="landing-shell">
      <section className="poster" aria-label="Oliveira Imóveis - Portofino Street Mall">
        <img
          src="/assets/oliveira-portofino-landing.png"
          alt="Landing page da Oliveira Imóveis: espaço comercial premium no Portofino Street Mall, Rua Henrique Badaró Portugal, Buritis, Belo Horizonte."
          width="1024"
          height="1536"
          fetchPriority="high"
        />
        <button
          className="cta-layer"
          type="button"
          onClick={openForm}
          aria-label="Solicitar análise estratégica pelo WhatsApp"
        />
      </section>

      <section id="contato" className="fallback" aria-label="Contato">
        <h1>Portofino Street Mall</h1>
        <p>
          Espaço comercial premium no Buritis para clínicas, wellness, pilates,
          fisioterapia, psicologia e operações de saúde.
        </p>
        <button className="button" type="button" onClick={openForm}>
          Solicitar análise estratégica
        </button>
      </section>

      <section className="details" aria-label="Diferenciais do imóvel">
        {details.map(([title, text]) => (
          <div className="detail" key={title}>
            <strong>{title}</strong>
            <span>{text}</span>
          </div>
        ))}
      </section>

      <LeadFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </main>
  );
}
