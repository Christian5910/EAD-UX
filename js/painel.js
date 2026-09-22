/* Painel de perguntas no modelo do quiz de referência: uma pergunta por vez,
   barra de progresso, contador, dica, explicação, Avançar, resultado e progresso salvo.
   Usado pelo Quiz e pelo Mapa de feedbacks. */
(function () {
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m];
    });
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  window.criarPainel = function (cfg) {
    var root = document.getElementById(cfg.rootId);
    var live = document.getElementById(cfg.liveId);
    var user = EAD.getUser();
    var KEY = cfg.storageKey + ':' + ((user && user.email) ? user.email.toLowerCase() : 'anonimo');
    var PREFIX = cfg.prefixes || ['A', 'B', 'C', 'D', 'E'];
    var s = null;

    function save() { EAD.Store.set(KEY, JSON.stringify(s)); }

    function load() {
      try {
        var v = JSON.parse(EAD.Store.get(KEY));
        var n = cfg.items.length;
        if (v && v.data && v.data.length === n && v.answers && v.answers.length === n) { s = v; return true; }
      } catch (e) { /* começa do zero */ }
      return false;
    }

    function build() {
      return cfg.items.map(function (it) {
        var idx = it.options.map(function (t, i) { return { t: t, i: i }; });
        var list = cfg.shuffle ? shuffle(idx) : idx;
        return {
          text: it.text, hint: it.hint || '', explanation: it.explanation,
          options: list.map(function (o) { return o.t; }),
          correct: list.findIndex(function (o) { return o.i === it.correct; })
        };
      });
    }

    function reset(moveFocus) {
      var n = cfg.items.length;
      s = { data: build(), index: 0, answers: new Array(n).fill(null), status: new Array(n).fill(null), finished: false };
      save();
      render(moveFocus ? 'question' : undefined);
    }

    function score() { return s.status.filter(function (x) { return x === true; }).length; }
    function errors() { return s.status.filter(function (x) { return x === false; }).length; }
    function announce(msg) { if (live) live.textContent = msg; }

    function progressHtml() {
      var dots = s.data.map(function (_, i) {
        var c = 'step-dot';
        if (s.status[i] === true) c += ' completed';
        else if (s.status[i] === false) c += ' incorrect';
        if (i === s.index) c += ' active';
        return '<div class="' + c + '"></div>';
      }).join('');
      return '<div class="progress-row">' +
        '<div class="steps-container" aria-hidden="true">' + dots + '</div>' +
        '<div class="stats-row">' +
        '<div class="question-counter">' + cfg.itemLabel + ' ' + (s.index + 1) + ' de ' + s.data.length + '</div>' +
        '<div class="score-badges">' +
        '<span class="badge-correct" aria-label="' + score() + ' acertos">✓ ' + score() + '</span>' +
        '<span class="badge-incorrect" aria-label="' + errors() + ' erros">✗ ' + errors() + '</span>' +
        '</div></div></div>';
    }

    function render(focus) {
      if (s.finished || s.index >= s.data.length) { showResult(focus !== undefined); return; }

      var q = s.data[s.index];
      var selected = s.answers[s.index];
      var answered = selected !== null;
      var isLast = s.index === s.data.length - 1;

      var opts = q.options.map(function (opt, i) {
        var cls = '', tag = '';
        if (answered) {
          if (i === q.correct) {
            cls = ' correct-highlight';
            tag = '<span class="option-tag">' + (i === selected ? 'Sua resposta, correta' : 'Resposta correta') + '</span>';
          } else if (i === selected) {
            cls = ' wrong-highlight';
            tag = '<span class="option-tag">Sua resposta, incorreta</span>';
          }
        }
        return '<button type="button" class="option-card' + cls + '" data-i="' + i + '"' + (answered ? ' disabled' : '') + '>' +
          '<span class="option-prefix">' + PREFIX[i] + '.</span>' +
          '<span class="option-text">' + esc(opt) + tag + '</span></button>';
      }).join('');

      var explanation = '';
      if (answered) {
        var ok = selected === q.correct;
        explanation = '<div class="explanation-box">' +
          (ok ? '<span class="verdict-ok">✓ Correto.</span> ' : '<span class="verdict-err">✗ Errado.</span> ') +
          esc(q.explanation) + '</div>';
      }

      var hint = q.hint
        ? '<div class="hint-wrapper"><button type="button" class="hint-trigger" aria-expanded="false" aria-controls="painelDica">Mostrar dica</button>' +
          '<div id="painelDica" class="hint-text">' + esc(q.hint) + '</div></div>'
        : '';

      root.innerHTML = progressHtml() +
        '<h2 class="question-text" id="painelPergunta" tabindex="-1">' + esc(q.text) + '</h2>' +
        '<div class="options-grid" role="group" aria-labelledby="painelPergunta">' + opts + '</div>' +
        explanation + hint +
        '<div class="next-container"><button type="button" class="btn btn-primary next-button" id="painelAvancar"' +
        (answered ? '' : ' disabled') + '>' + (isLast ? cfg.lastLabel : cfg.nextLabel) + '</button></div>';

      root.querySelectorAll('.option-card:not([disabled])').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var chosen = parseInt(btn.getAttribute('data-i'), 10);
          s.answers[s.index] = chosen;
          s.status[s.index] = chosen === q.correct;
          save();
          render('next');
          announce((chosen === q.correct ? 'Correto. ' : 'Errado. A resposta correta é: ' + q.options[q.correct] + '. ') + q.explanation);
        });
      });

      var trigger = root.querySelector('.hint-trigger');
      if (trigger) {
        trigger.addEventListener('click', function () {
          var box = document.getElementById('painelDica');
          var show = !box.classList.contains('show');
          box.classList.toggle('show', show);
          trigger.setAttribute('aria-expanded', show ? 'true' : 'false');
          trigger.textContent = show ? 'Ocultar dica' : 'Mostrar dica';
        });
      }

      var next = document.getElementById('painelAvancar');
      next.addEventListener('click', function () {
        if (s.answers[s.index] === null) return;
        if (s.index + 1 < s.data.length) { s.index++; } else { s.finished = true; }
        save();
        render('question');
      });

      if (focus === 'next') next.focus();
      else if (focus === 'question') document.getElementById('painelPergunta').focus({ preventScroll: false });
    }

    function showResult(moveFocus) {
      var total = s.data.length, correct = score();
      var percent = Math.round((correct / total) * 100);
      root.innerHTML = '<div class="result-container">' +
        cfg.renderResult({ correct: correct, total: total, percent: percent, data: s.data, answers: s.answers, status: s.status, esc: esc }) +
        '<button type="button" class="btn btn-primary" id="painelReiniciar">' + cfg.restartLabel + '</button></div>';
      document.getElementById('painelReiniciar').addEventListener('click', function () { reset(true); });
      announce('Resultado: ' + correct + ' de ' + total + '.');
      if (moveFocus) { var h = document.getElementById('painelResultado'); if (h) h.focus(); }
    }

    if (load()) render(); else reset(false);
  };
})();
