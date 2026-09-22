/* Mapa de feedbacks: o aluno classifica situações nas cinco categorias do framework HEART.
   As situações e explicações vêm dos exemplos do Tema 06 da apostila (páginas 76 a 84 do PDF). */
criarPainel({
  rootId: 'dynamicContent',
  liveId: 'mapaLive',
  storageKey: 'ux_tema06_mapa_v1',
  itemLabel: 'Situação',
  nextLabel: 'Próxima situação',
  lastLabel: 'Ver meu mapa',
  restartLabel: 'Refazer a atividade',
  shuffle: false,
  prefixes: ['H', 'E', 'A', 'R', 'T'],
  items: [
    { text: "O time de suporte recebe muitas reclamações sobre a nova funcionalidade.",
      options: ["Happiness (felicidade)", "Engagement (engajamento)", "Adoption (adoção)", "Retention (retenção)", "Task Success (sucesso da tarefa)"],
      correct: 0,
      explanation: "Happiness mede o nível de satisfação do usuário. O time de suporte ouve os usuários o tempo todo, e as reclamações mostram o quanto eles gostam, ou não, do produto." },

    { text: "O NPS mostra mais detratores do que promotores depois do redesign das interfaces do aplicativo.",
      options: ["Happiness (felicidade)", "Engagement (engajamento)", "Adoption (adoção)", "Retention (retenção)", "Task Success (sucesso da tarefa)"],
      correct: 0,
      explanation: "O NPS separa clientes promotores e detratores e ajuda a entender o nível de felicidade. A apostila cita o redesign das interfaces como um caso de uso dessa categoria." },

    { text: "O Google Analytics mostra quais funcionalidades os usuários mais usam e quanto tempo passam no produto.",
      options: ["Happiness (felicidade)", "Engagement (engajamento)", "Adoption (adoção)", "Retention (retenção)", "Task Success (sucesso da tarefa)"],
      correct: 1,
      explanation: "Engagement mede a intensidade das interações: as funcionalidades com que os usuários mais se engajam e o tempo que passam. O Google Analytics é uma das ferramentas citadas para isso." },

    { text: "Uma plataforma de vídeos mede quantos minutos de vídeo mantêm os usuários assistindo, comentando e curtindo.",
      options: ["Happiness (felicidade)", "Engagement (engajamento)", "Adoption (adoção)", "Retention (retenção)", "Task Success (sucesso da tarefa)"],
      correct: 1,
      explanation: "É o exemplo do YouTube na apostila. Manter os usuários ativos, isto é, vendo vídeos, comentando, curtindo e se inscrevendo em canais, é engajamento." },

    { text: "A equipe conta quantos novos usuários chegaram ao produto neste mês.",
      options: ["Happiness (felicidade)", "Engagement (engajamento)", "Adoption (adoção)", "Retention (retenção)", "Task Success (sucesso da tarefa)"],
      correct: 2,
      explanation: "Adoption mede a quantidade de novos usuários do produto em um determinado período de tempo." },

    { text: "A equipe acompanha o número de upgrades para a versão mais recente do produto.",
      options: ["Happiness (felicidade)", "Engagement (engajamento)", "Adoption (adoção)", "Retention (retenção)", "Task Success (sucesso da tarefa)"],
      correct: 2,
      explanation: "O número de upgrades para a versão mais recente é um dos exemplos de dados de adoção citados na apostila, ao lado de novos usuários e novas assinaturas." },

    { text: "A taxa de cancelamento do aplicativo aumentou nos últimos meses.",
      options: ["Happiness (felicidade)", "Engagement (engajamento)", "Adoption (adoção)", "Retention (retenção)", "Task Success (sucesso da tarefa)"],
      correct: 3,
      explanation: "A taxa de cancelamento é o churn rate, ligado à retenção. O custo de adquirir novos usuários pode ser alto, então uma taxa de churn alta preocupa." },

    { text: "A equipe monitora quantos usuários continuam ativos depois de um período específico.",
      options: ["Happiness (felicidade)", "Engagement (engajamento)", "Adoption (adoção)", "Retention (retenção)", "Task Success (sucesso da tarefa)"],
      correct: 3,
      explanation: "Retention é a quantidade de usuários que permanecem ativos ao longo de um período de tempo específico." },

    { text: "Em um e-commerce, o caminho até a compra do produto está complicado e difícil de fazer.",
      options: ["Happiness (felicidade)", "Engagement (engajamento)", "Adoption (adoção)", "Retention (retenção)", "Task Success (sucesso da tarefa)"],
      correct: 4,
      explanation: "A compra é a tarefa essencial de um e-commerce. Se o caminho até ela for muito complicado ou difícil, há uma falha grave de usabilidade, foco de Task Success." },

    { text: "Os usuários demoram para encontrar algo que deveria ser essencial no produto.",
      options: ["Happiness (felicidade)", "Engagement (engajamento)", "Adoption (adoção)", "Retention (retenção)", "Task Success (sucesso da tarefa)"],
      correct: 4,
      explanation: "Task Success mostra o quanto é fácil ou difícil realizar as tarefas do usuário. Ninguém quer perder tempo procurando algo que deveria ser essencial em um produto." }
  ],
  renderResult: function (r) {
    var groups = {};
    var order = [];
    r.data.forEach(function (q, i) {
      var cat = q.options[q.correct];
      if (!groups[cat]) { groups[cat] = []; order.push(cat); }
      var mine = r.answers[i];
      var ok = mine === q.correct;
      groups[cat].push('<li>' + r.esc(q.text) + '<br>' +
        (ok ? '<span class="verdict-ok">✓ Você acertou.</span>'
            : '<span class="verdict-err">✗ Você marcou ' + r.esc(q.options[mine]) + '.</span>') + '</li>');
    });
    var html = order.map(function (cat) {
      return '<section class="map-group"><h3>' + r.esc(cat) + '</h3><ul>' + groups[cat].join('') + '</ul></section>';
    }).join('');

    var msg = "Releia a seção 4 da página Conteúdo e tente de novo.";
    if (r.percent === 100) msg = "Você classificou todas as situações corretamente.";
    else if (r.percent >= 70) msg = "Você acertou a maior parte. Veja abaixo as situações que ficaram em outra categoria.";
    return '<h2 id="painelResultado" tabindex="-1">Seu mapa de feedbacks</h2>' +
      '<div class="final-score-text">' + r.correct + ' / ' + r.total + '</div>' +
      '<p>' + msg + '</p><div class="map-groups">' + html + '</div>';
  }
});
