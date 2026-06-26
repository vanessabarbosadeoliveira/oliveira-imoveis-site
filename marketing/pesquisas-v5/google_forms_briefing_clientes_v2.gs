/**
 * Oliveira Imóveis · Análise de Mercado V5
 * Cria 2 Google Forms (acupuntura + loja de roupa).
 * Conta: oliveiraimoveismkt@gmail.com
 *
 * COMO USAR:
 *   - Rode "criarOsDois" pra criar os 2 de uma vez
 *   - OU rode "criarFormularioAcupuntura" / "criarFormularioLojaRoupa" separados
 *   - Logo da Oliveira é adicionada DEPOIS direto no Forms (Personalizar tema > Imagem cabeçalho)
 */

// ===== FORM ACUPUNTURA =====
function criarFormularioAcupuntura() {
  var form = FormApp.create('Análise de Mercado · Portofino Buritis · Clínica de Acupuntura');

  form.setDescription(
    'Oliveira Imóveis · Inteligência Comercial\n\n' +
    'Esta análise vai te ajudar a decidir COM SEGURANÇA se vale abrir sua clínica ' +
    'de acupuntura no Portofino, em Buritis (BH). Vamos verificar concorrentes diretos, ' +
    'demanda real do bairro e projetar break-even.\n\n' +
    'São 10 perguntas (5 minutos). Em até 24h você recebe: relatório PDF com veredito, ' +
    'concorrentes diretos no raio 1,5km, projeção de break-even e recomendação de posicionamento.\n\n' +
    'Curadoria inteligente de pontos comerciais — Oliveira Imóveis'
  );

  form.addSectionHeaderItem()
    .setTitle('Sobre você e sua operação atual');

  form.addTextItem()
    .setTitle('1. De onde você está vindo?')
    .setHelpText('Cidade + bairro de origem (ex: "Goiânia / Setor Bueno")')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('2. Quanto tempo você opera com acupuntura?')
    .setChoiceValues(['Menos de 1 ano','1 a 3 anos','3 a 5 anos','5 a 10 anos','Mais de 10 anos'])
    .setRequired(true);

  form.addTextItem()
    .setTitle('3. Qual seu ticket médio atual por consulta? (R$)')
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('4. Qual é o seu diferencial principal?')
    .setHelpText('Pode marcar mais de um. Esta resposta é a MAIS IMPORTANTE.')
    .setChoiceValues([
      'Acupuntura estética / facial',
      'Dor crônica / ortopédica',
      'Medicina chinesa tradicional (MTC)',
      'Fisioterapia integrada',
      'Acupuntura para gestantes / fertilidade',
      'Acupuntura para emagrecimento',
      'Tratamento de enxaqueca / dor de cabeça',
      'Outro (descrevo abaixo)'
    ])
    .setRequired(true);

  form.addTextItem()
    .setTitle('4b. Se marcou "Outro" acima, descreva')
    .setRequired(false);

  form.addSectionHeaderItem()
    .setTitle('Sobre o espaço no Portofino');

  form.addTextItem()
    .setTitle('5. Metragem da sala oferecida (m²)')
    .setHelpText('Acupuntura precisa de mín. 30m². Ideal: 50-60m².')
    .setRequired(true);

  form.addTextItem()
    .setTitle('6. Valor do aluguel pedido (R$/mês)')
    .setHelpText('Inclua condomínio se for separado')
    .setRequired(true);

  form.addTextItem()
    .setTitle('7. Quanto você paga hoje? (R$/mês)')
    .setHelpText('Ou "0 - atendo em casa" / "compartilho sala"')
    .setRequired(true);

  form.addSectionHeaderItem()
    .setTitle('Bonus · ajuda muito a recomendar');

  form.addMultipleChoiceItem()
    .setTitle('8. Vai trazer equipe ou contratar local?')
    .setChoiceValues([
      'Vou atender sozinha(o)',
      'Trago equipe da operação atual',
      'Quero contratar profissionais locais em BH',
      'Modelo misto'
    ])
    .setRequired(false);

  form.addCheckboxItem()
    .setTitle('9. Modelo de pagamento que atende')
    .setChoiceValues(['Particular','Convênio (planos)','Vouchers (Gympass/TotalPass)','Outros'])
    .setRequired(false);

  form.addTextItem()
    .setTitle('10. Instagram com público fiel?')
    .setHelpText('Link do perfil + nº seguidores. Se não tiver, escreva "não tenho".')
    .setRequired(false);

  form.setConfirmationMessage(
    'Recebemos suas respostas! Em até 24h a Vanessa envia o relatório completo no WhatsApp. ' +
    'Oliveira Imóveis · Curadoria inteligente de pontos comerciais.'
  );
  form.setCollectEmail(true);

  var url = form.getPublishedUrl();
  Logger.log('========================================');
  Logger.log('FORMULARIO ACUPUNTURA CRIADO!');
  Logger.log('Link p/ cliente: ' + url);
  Logger.log('Link p/ editar: ' + form.getEditUrl());
  Logger.log('========================================');
}

// ===== FORM LOJA DE ROUPA =====
function criarFormularioLojaRoupa() {
  var form = FormApp.create('Análise de Mercado · Portofino Buritis · Loja de Roupa');

  form.setDescription(
    'Oliveira Imóveis · Inteligência Comercial\n\n' +
    'Esta análise vai te ajudar a decidir COM SEGURANÇA se vale abrir sua loja de roupa ' +
    'no Portofino, em Buritis (BH). Vamos verificar concorrentes, perfil de público do mall ' +
    'e projetar break-even.\n\n' +
    'São 12 perguntas (7 minutos). Em até 24h você recebe: relatório PDF com veredito, ' +
    'mapa de concorrentes por segmento, perfil do público do mall, projeção de break-even.\n\n' +
    'Curadoria inteligente de pontos comerciais — Oliveira Imóveis'
  );

  form.addSectionHeaderItem()
    .setTitle('Sobre você e sua operação atual');

  form.addTextItem()
    .setTitle('1. De onde você está vindo?')
    .setHelpText('Cidade + bairro de origem')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('2. Quanto tempo você opera com moda?')
    .setChoiceValues(['Menos de 1 ano','1 a 3 anos','3 a 5 anos','5 a 10 anos','Mais de 10 anos'])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('3. Como você vende hoje?')
    .setChoiceValues([
      'Loja física própria',
      'Loja em galeria / shopping',
      'Showroom em casa',
      'Instagram / WhatsApp',
      'Marketplace (Shopee, Mercado Livre, Enjoei)',
      'Site próprio',
      'Outro'
    ])
    .setRequired(true);

  form.addSectionHeaderItem()
    .setTitle('Sobre o produto que você vende')
    .setHelpText('Estas respostas DEFINEM se há gap ou competição no Portofino.');

  form.addMultipleChoiceItem()
    .setTitle('4. Segmento principal')
    .setChoiceValues([
      'Feminina adulta · casual / lifestyle',
      'Feminina · festa / social / casamento',
      'Feminina · fitness / atlética',
      'Feminina · lingerie / íntima',
      'Feminina · plus size',
      'Infantil',
      'Masculina',
      'Unissex / streetwear',
      'Premium · autoral / sob medida',
      'Outro (descrevo abaixo)'
    ])
    .setRequired(true);

  form.addTextItem()
    .setTitle('4b. Se marcou "Outro", descreva')
    .setRequired(false);

  form.addMultipleChoiceItem()
    .setTitle('5. Faixa de preço média por peça')
    .setChoiceValues([
      'Popular: R$ 30-100',
      'Médio: R$ 100-300',
      'Médio-alto: R$ 300-600',
      'Premium: R$ 600+'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('6. Marca própria ou revenda?')
    .setChoiceValues([
      'Marca própria · autoral',
      'Revenda de marcas (multimarcas)',
      'Misto (própria + revenda)'
    ])
    .setRequired(true);

  form.addSectionHeaderItem()
    .setTitle('Sobre o espaço no Portofino');

  form.addTextItem()
    .setTitle('7. Metragem da loja (m²)')
    .setHelpText('Pequena: 25-40m² · Média: 40-80m² · Grande: 80m²+')
    .setRequired(true);

  form.addTextItem()
    .setTitle('8. Valor do aluguel pedido (R$/mês)')
    .setRequired(true);

  form.addTextItem()
    .setTitle('9. Quanto você paga hoje? (R$/mês)')
    .setHelpText('Ou "0 - vendo só online" / "showroom em casa"')
    .setRequired(true);

  form.addSectionHeaderItem()
    .setTitle('Bonus · ajuda muito a recomendar');

  form.addTextItem()
    .setTitle('10. Instagram com público fiel?')
    .setHelpText('Link + nº seguidores. Se não tiver, escreva "não tenho".')
    .setRequired(false);

  form.addTextItem()
    .setTitle('11. Faturamento médio mensal atual (R$)')
    .setHelpText('Opcional · ajuda a projetar break-even.')
    .setRequired(false);

  form.addMultipleChoiceItem()
    .setTitle('12. Quem vai atender a loja?')
    .setChoiceValues([
      'Eu mesma(o) atendo',
      'Vou contratar 1 vendedora',
      'Vou contratar 2+ vendedoras',
      'Equipe mista',
      'Ainda não decidi'
    ])
    .setRequired(false);

  form.setConfirmationMessage(
    'Recebemos suas respostas! Em até 24h a Vanessa envia o relatório completo no WhatsApp. ' +
    'Oliveira Imóveis · Curadoria inteligente de pontos comerciais.'
  );
  form.setCollectEmail(true);

  var url = form.getPublishedUrl();
  Logger.log('========================================');
  Logger.log('FORMULARIO LOJA DE ROUPA CRIADO!');
  Logger.log('Link p/ cliente: ' + url);
  Logger.log('Link p/ editar: ' + form.getEditUrl());
  Logger.log('========================================');
}

// ===== COMBO =====
function criarOsDois() {
  Logger.log('Criando os 2 formularios...');
  criarFormularioAcupuntura();
  criarFormularioLojaRoupa();
  Logger.log('PRONTO! Os 2 estao no seu Drive.');
}
