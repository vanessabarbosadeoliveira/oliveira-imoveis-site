import Link from "next/link";

export const metadata = {
  title: "Termos de Uso | Oliveira Imóveis"
};

export default function TermsPage() {
  return (
    <main className="legal-page">
      <Link href="/">Voltar para a landing</Link>
      <h1>Termos de Uso</h1>
      <p>
        Estes Termos de Uso regulam o acesso às páginas, formulários e canais
        digitais da Oliveira Imóveis relacionados à divulgação de imóveis,
        oportunidades comerciais e atendimento ao cliente.
      </p>

      <h2>1. Uso do site</h2>
      <p>
        Ao navegar pelo site ou enviar informações por formulário, você declara
        que fornecerá dados verdadeiros e utilizará os canais apenas para fins
        lícitos, como solicitar informações, agendar atendimento ou receber
        contato comercial.
      </p>

      <h2>2. Informações sobre imóveis</h2>
      <p>
        As informações apresentadas sobre imóveis, valores, disponibilidade,
        condições comerciais e características podem ser atualizadas sem aviso
        prévio. A confirmação final deve ser feita diretamente com a equipe da
        Oliveira Imóveis.
      </p>

      <h2>3. Formulários e WhatsApp</h2>
      <p>
        Ao preencher um formulário, você autoriza a Oliveira Imóveis a utilizar
        os dados informados para contato, atendimento, análise de interesse e
        envio de informações relacionadas ao imóvel ou serviço solicitado.
      </p>

      <h2>4. Responsabilidades</h2>
      <p>
        A Oliveira Imóveis busca manter suas páginas disponíveis e atualizadas,
        mas não garante funcionamento ininterrupto, ausência de erros técnicos
        ou disponibilidade permanente de links externos, como WhatsApp,
        plataformas de anúncios e ferramentas de análise.
      </p>

      <h2>4.1. Isenção de responsabilidade sobre a pesquisa de mercado</h2>
      <p>
        A pesquisa de mercado fornecida pela Oliveira Imóveis é elaborada com
        base nas informações disponíveis no momento da solicitação, com caráter
        exclusivamente informativo e orientativo. O usuário declara que a
        solicita por livre e espontânea vontade, ciente de que:
      </p>
      <ul>
        <li>A pesquisa não constitui consultoria financeira, imobiliária ou jurídica.</li>
        <li>
          Os resultados, projeções e análises apresentados são estimativas,
          sujeitos a variações de mercado e circunstâncias externas não
          controláveis pela Oliveira Imóveis.
        </li>
        <li>
          A decisão de abrir, expandir ou manter um negócio é de
          responsabilidade exclusiva do usuário.
        </li>
        <li>
          A Oliveira Imóveis não se responsabiliza por perdas, prejuízos ou
          frustrações decorrentes do uso ou interpretação das informações
          contidas na pesquisa.
        </li>
      </ul>

      <h2>5. Propriedade intelectual</h2>
      <p>
        Textos, imagens, marcas, layouts e demais conteúdos das páginas da
        Oliveira Imóveis não devem ser copiados, reproduzidos ou utilizados sem
        autorização prévia.
      </p>

      <h2>6. Privacidade</h2>
      <p>
        O tratamento de dados pessoais é descrito na{" "}
        <Link href="/politica-de-privacidade">Política de Privacidade</Link>,
        que integra estes Termos de Uso.
      </p>

      <h2>7. Alterações</h2>
      <p>
        Estes termos podem ser atualizados para refletir mudanças nos serviços,
        canais de atendimento, exigências legais ou práticas comerciais.
      </p>
    </main>
  );
}
