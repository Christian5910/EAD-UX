/* Telas de acesso: login, cadastro e recuperação de senha (simulados).
   Segurança propositalmente simples, só para demonstração. */
(function () {
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function $(id) { return document.getElementById(id); }

  /* ---------- validações (retornam mensagem ou '') ---------- */
  var validators = {
    identificador: function (v) {
      v = v.trim();
      if (!v) return 'Informe seu e-mail ou usuário.';
      if (v.indexOf('@') > -1 && !EMAIL_RE.test(v)) return 'O e-mail parece incompleto. Exemplo: nome@dominio.com';
      if (v.indexOf('@') === -1 && v.length < 3) return 'O usuário precisa ter pelo menos 3 caracteres.';
      return '';
    },
    email: function (v) {
      v = v.trim();
      if (!v) return 'Informe seu e-mail.';
      if (!EMAIL_RE.test(v)) return 'O e-mail parece incompleto. Exemplo: nome@dominio.com';
      return '';
    },
    nome: function (v) {
      v = v.trim();
      if (!v) return 'Informe seu nome.';
      if (v.length < 2) return 'O nome precisa ter pelo menos 2 letras.';
      return '';
    },
    senha: function (v) {
      if (!v) return 'Informe sua senha.';
      if (v.length < 6) return 'A senha precisa ter pelo menos 6 caracteres (faltam ' + (6 - v.length) + ').';
      return '';
    }
  };

  /* ---------- erros de campo ---------- */
  function setError(id, msg) {
    var input = $(id), err = $(id + 'Error');
    if (!input) return;
    input.classList.add('error');
    input.setAttribute('aria-invalid', 'true');
    input.classList.remove('valid');
    if (err) { err.textContent = msg; err.classList.add('show'); }
  }
  function clearError(id) {
    var input = $(id), err = $(id + 'Error');
    if (!input) return;
    input.classList.remove('error');
    input.removeAttribute('aria-invalid');
    if (err) { err.textContent = ''; err.classList.remove('show'); }
  }
  function validateField(id, rule) {
    var input = $(id);
    var msg = validators[rule](input.value);
    if (msg) { setError(id, msg); return msg; }
    clearError(id);
    return '';
  }

  /* ---------- resumo de erros no topo do formulário ---------- */
  function showSummary(items) {
    var box = $('alert');
    if (!box) return;
    var html = (items.length === 1 ? 'Corrija 1 campo para continuar:' : 'Corrija ' + items.length + ' campos para continuar:') + '<ul>';
    items.forEach(function (it) {
      html += '<li><a href="#' + it.id + '">' + it.label + ': ' + it.msg + '</a></li>';
    });
    box.innerHTML = html + '</ul>';
    box.className = 'alert alert-error show';
    box.setAttribute('tabindex', '-1');
    box.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var f = $(a.getAttribute('href').slice(1));
        if (f) f.focus();
      });
    });
    box.focus();
  }
  function showMessage(msg, type) {
    var box = $('alert');
    if (!box) return;
    box.textContent = msg;
    box.className = 'alert alert-' + (type || 'success') + ' show';
    box.setAttribute('tabindex', '-1');
    box.focus();
  }
  function hideAlert() {
    var box = $('alert');
    if (box) { box.className = 'alert'; box.innerHTML = ''; }
  }

  /* ---------- botão ocupado ---------- */
  function setBusy(btn, text) {
    btn.dataset.label = btn.textContent;
    btn.setAttribute('aria-disabled', 'true');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner" aria-hidden="true"></span><span>' + text + '</span>';
  }
  function unsetBusy(btn) {
    btn.disabled = false;
    btn.removeAttribute('aria-disabled');
    btn.textContent = btn.dataset.label || 'Enviar';
  }

  /* ---------- validação ao sair do campo / ao digitar ---------- */
  function wire(fields) {
    fields.forEach(function (f) {
      var input = $(f.id);
      if (!input) return;
      input.addEventListener('blur', function () {
        if (input.value !== '' || input.dataset.touched) { input.dataset.touched = '1'; validateField(f.id, f.rule); }
      });
      input.addEventListener('input', function () {
        if (input.classList.contains('error')) validateField(f.id, f.rule); /* some o erro assim que corrige */
      });
    });
  }
  function validateAll(fields) {
    var errs = [];
    fields.forEach(function (f) {
      var msg = validateField(f.id, f.rule);
      if (msg) errs.push({ id: f.id, label: f.label, msg: msg });
    });
    return errs;
  }

  /* ---------- senha: mostrar/ocultar, regras ao vivo, Caps Lock ---------- */
  function setupPassword() {
    var input = $('senha');
    if (!input) return;

    document.querySelectorAll('.toggle-pass').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.setAttribute('aria-pressed', show ? 'true' : 'false');
        btn.firstChild.textContent = show ? 'Ocultar' : 'Mostrar';
      });
    });

    var rules = document.querySelectorAll('.password-rules [data-rule]');
    function updateRules() {
      var v = input.value;
      var state = { len: v.length >= 6, mix: /[A-Za-z]/.test(v) && /\d/.test(v) };
      rules.forEach(function (li) {
        var ok = state[li.getAttribute('data-rule')];
        li.classList.toggle('ok', ok);
        var st = li.querySelector('.rule-state');
        if (st) st.textContent = ok ? ' (cumprida)' : ' (pendente)';
      });
    }
    input.addEventListener('input', updateRules);
    updateRules();

    var caps = $('capsWarning');
    function checkCaps(e) {
      if (!caps || !e.getModifierState) return;
      caps.classList.toggle('show', e.getModifierState('CapsLock'));
    }
    input.addEventListener('keydown', checkCaps);
    input.addEventListener('keyup', checkCaps);
    input.addEventListener('blur', function () { if (caps) caps.classList.remove('show'); });
  }

  setupPassword();

  /* ---------- LOGIN ---------- */
  var loginForm = $('loginForm');
  if (loginForm) {
    var loginFields = [
      { id: 'email', rule: 'identificador', label: 'E-mail ou usuário' },
      { id: 'senha', rule: 'senha', label: 'Senha' }
    ];
    wire(loginFields);

    var current = EAD.getUser();
    var already = $('already');
    if (current && already) {
      already.innerHTML = 'Você já está conectado como ' + EAD.displayName(current) + '. ' +
        '<a href="home.html">Continuar a aula</a>';
      already.classList.add('show');
    }

    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var errs = validateAll(loginFields);
      if (errs.length) { showSummary(errs); return; }
      hideAlert();
      var id = $('email').value.trim();
      var btn = loginForm.querySelector('button[type="submit"]');
      setBusy(btn, 'Entrando...');
      setTimeout(function () {
        EAD.setUser({ email: id, nome: id.split('@')[0] || 'Aluno' });
        window.location.href = 'home.html';
      }, 700);
    });
  }

  /* ---------- CADASTRO ---------- */
  var cadastroForm = $('cadastroForm');
  if (cadastroForm) {
    var cadFields = [
      { id: 'nome', rule: 'nome', label: 'Nome completo' },
      { id: 'email', rule: 'email', label: 'E-mail' },
      { id: 'senha', rule: 'senha', label: 'Senha' }
    ];
    wire(cadFields);
    cadastroForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var errs = validateAll(cadFields);
      if (errs.length) { showSummary(errs); return; }
      var nome = $('nome').value.trim(), email = $('email').value.trim();
      var btn = cadastroForm.querySelector('button[type="submit"]');
      setBusy(btn, 'Criando conta...');
      setTimeout(function () {
        EAD.setUser({ email: email, nome: nome.split(' ')[0] });
        var box = $('alert');
        box.innerHTML = 'Conta criada, ' + nome.split(' ')[0] + '! Você será levado à aula em instantes. ' +
          '<a href="home.html">Ir agora</a>';
        box.className = 'alert alert-success show';
        box.setAttribute('tabindex', '-1');
        box.focus();
        setTimeout(function () { window.location.href = 'home.html'; }, 1800);
      }, 600);
    });
  }

  /* ---------- RECUPERAR SENHA ---------- */
  var recForm = $('recuperarForm');
  if (recForm) {
    var recFields = [{ id: 'email', rule: 'email', label: 'E-mail cadastrado' }];
    wire(recFields);
    recForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var errs = validateAll(recFields);
      if (errs.length) { showSummary(errs); return; }
      var email = $('email').value.trim();
      var btn = recForm.querySelector('button[type="submit"]');
      setBusy(btn, 'Enviando...');
      setTimeout(function () {
        unsetBusy(btn);
        btn.textContent = 'Reenviar link';
        showMessage('Se ' + email + ' estiver cadastrado, o link de recuperação chega em alguns minutos. ' +
          'Esta é uma simulação e nenhum e-mail real é enviado.', 'success');
      }, 700);
    });
  }
})();
