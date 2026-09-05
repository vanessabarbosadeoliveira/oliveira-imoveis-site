import "./globals.css";
import TrackingScripts from "../components/TrackingScripts";

export const metadata = {
  metadataBase: new URL("https://wispy-field-ab1d.vanessabarbosadeoliveira9.workers.dev"),
  title: "Oliveira Imóveis | Portofino Street Mall",
  description:
    "Espaço comercial premium no Portofino Street Mall, no Buritis, para clínicas, wellness, pilates, fisioterapia, psicologia e operações de saúde.",
  openGraph: {
    title: "Espaço comercial premium no Buritis",
    description:
      "Solicite uma análise estratégica para sua clínica, wellness ou operação de saúde no Portofino Street Mall.",
    type: "website",
    images: ["/assets/oliveira-portofino-landing.png"]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <TrackingScripts />
        {children}
      </body>
    </html>
  );
}
