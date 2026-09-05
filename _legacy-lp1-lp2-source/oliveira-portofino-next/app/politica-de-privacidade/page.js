import Link from "next/link";

export const metadata = {
  title: "Política de Privacidade | Oliveira Imóveis"
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <Link href="/">Voltar para a landing</Link>
      <h1>Política de Privacidade</h1>
      <p>
        Esta Política de Privacidade explica como a Oliveira Imóveis coleta,
        utiliza e protege dados pessoais enviados em suas páginas, formulários e
        canais digitais, em conformidade com a Lei Geral de Proteção de Dados
        Pessoais, Lei nº 13.709/2018.
      </p>

      <h2>1. Dados coletados</h2>
      <p>
        Podemos coletar dados fornecidos diretamente por você, como nome,
        e-mail, telefone/WhatsApp e mensagem de interesse. Também podemos
        registrar dados de navegação e origem da campanha, como página acessada,
        data, horário, dispositivo, fonte de tráfego e parâmetros UTM.
      </p>

      <h2>2. Finalidades de uso</h2>
      <p>Os dados podem ser utilizados para:</p>
      <ul>
        <li>responder solicitações feitas pelo formulário ou WhatsApp;</li>
        <li>entrar em contato sobre imóveis, visitas e oportunidades comerciais;</li>
        <li>organizar atendimento e histórico de relacionamento;</li>
        <li>medir desempenho de campanhas e melhorar a comunicação;</li>
        <li>cumprir obrigações legais e regulatórias quando necessário.</li>
      </ul>

      <h2>3. Base legal</h2>
      <p>
        O tratamento pode ocorrer com base no consentimento fornecido no
        formulário, na execução de procedimentos preliminares relacionados ao
        atendimento solicitado, no legítimo interesse para melhoria dos serviços
        e no cumprimento de obrigações legais.
      </p>

      <h2>4. Compartilhamento</h2>
      <p>
        Os dados podem ser compartilhados com prestadores de serviço necessários
        para operação dos canais digitais, como ferramentas de hospedagem,
        análise, anúncios, CRM, automação e atendimento por WhatsApp. Esses
        parceiros devem utilizar os dados apenas para as finalidades contratadas.
      </p>

      <h2>5. Cookies e ferramentas de medição</h2>
      <p>
        A página pode utilizar tecnologias como Google Analytics, Meta Pixel e
        parâmetros UTM para medir visitas, origem de campanhas, interações com
        formulário e cliques para WhatsApp. Essas informações ajudam a entender
        quais campanhas geram contatos mais qualificados.
      </p>

      <h2>6. Conservação dos dados</h2>
      <p>
        Os dados serão mantidos pelo tempo necessário para atendimento,
        relacionamento comercial, análise de campanhas e cumprimento de
        obrigações legais. Quando não forem mais necessários, poderão ser
        excluídos ou anonimizados.
      </p>

      <h2>7. Direitos do titular</h2>
      <p>
        Você pode solicitar confirmação de tratamento, acesso, correção,
        exclusão, anonimização, portabilidade, revogação de consentimento e
        informações sobre compartilhamento, conforme previsto na LGPD.
      </p>

      <h2>8. Segurança</h2>
      <p>
        A Oliveira Imóveis adota medidas razoáveis para proteger dados pessoais
        contra acessos não autorizados, perda, alteração ou uso inadequado.
      </p>

      <h2>9. Contato</h2>
      <p>
        Para dúvidas ou solicitações sobre privacidade, entre em contato pelo
        WhatsApp:{" "}
        <a href="https://wa.me/5531999558360" target="_blank" rel="noopener noreferrer">
          (31) 99955-8360
        </a>.
      </p>

      <h2>10. Atualizações</h2>
      <p>
        Esta Política de Privacidade pode ser atualizada periodicamente. A versão
        vigente será sempre a publicada nesta página.
      </p>
    </main>
  );
}
