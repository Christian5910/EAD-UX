/* Páginas internas: acesso, barra superior, menu de seções e mídias. */
(function () {
  function $(id) { return document.getElementById(id); }

  /* ---------- Acesso (demonstração) ---------- */
  var user = EAD.getUser();
  if (!user) { window.location.replace('index.html'); return; }

  var nameEl = $('userName');
  if (nameEl) nameEl.textContent = EAD.displayName(user);

  document.querySelectorAll('[data-logout]').forEach(function (a) {
    a.addEventListener('click', function () { EAD.logout(); });
  });

  /* ---------- Barra superior: menu recolhido em telas pequenas ---------- */
  var header = document.querySelector('.site-header');
  var toggler = document.querySelector('.navbar-toggler');
  if (header && toggler) {
    function setMenu(open) {
      header.classList.toggle('open', open);
      toggler.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggler.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    }
    toggler.addEventListener('click', function () { setMenu(!header.classList.contains('open')); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('open')) { setMenu(false); toggler.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (header.classList.contains('open') && !header.contains(e.target)) setMenu(false);
    });
    window.matchMedia('(min-width: 1200px)').addEventListener('change', function (mq) { if (mq.matches) setMenu(false); });
  }

  /* ---------- Menu de seções (aside): aberto no computador, recolhido no celular ---------- */
  var details = document.querySelector('.side-details');
  if (details) {
    var wide = window.matchMedia('(min-width: 992px)');
    var sync = function () { details.open = wide.matches; };
    sync();
    wide.addEventListener('change', sync);
    details.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { if (!wide.matches) details.open = false; });
    });
  }

  /* ---------- Indica a seção que está na tela ("você está aqui") ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.side-nav a[href^="#"]'));
  if (links.length && 'IntersectionObserver' in window) {
    var visible = {};
    var ids = links.map(function (a) { return a.getAttribute('href').slice(1); });

    function mark() {
      links.forEach(function (a) { a.removeAttribute('aria-current'); });
      /* no fim da página, a última seção (curta) nunca chega à faixa de leitura */
      var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) { links[links.length - 1].setAttribute('aria-current', 'true'); return; }
      for (var i = 0; i < ids.length; i++) {
        if (visible[ids[i]]) { links[i].setAttribute('aria-current', 'true'); return; }
      }
    }
    window.addEventListener('scroll', mark, { passive: true });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting; });
      mark();
    }, { rootMargin: '-90px 0px -60% 0px', threshold: 0 });

    ids.forEach(function (id) { var t = $(id); if (t) io.observe(t); });
  }

  /* ---------- Áudio e vídeo: aviso quando o arquivo não está na pasta ---------- */
  function watchMedia(el, msg) {
    if (!el || !msg) return;
    function check() { if (el.error || el.networkState === 3) msg.hidden = false; }
    el.addEventListener('error', check, true);
    el.addEventListener('loadedmetadata', function () { msg.hidden = true; });
    window.addEventListener('load', function () { setTimeout(check, 300); });
    setTimeout(check, 1500);
  }
  watchMedia($('audioPlayer'), $('audioMsg'));

  var video = $('videoPlayer');
  if (video) {
    watchMedia(video, $('videoMsg'));
    var dur = $('videoDuration');
    video.addEventListener('loadedmetadata', function () {
      if (dur && isFinite(video.duration)) {
        var m = Math.floor(video.duration / 60), s = Math.round(video.duration % 60);
        dur.textContent = 'Duração: ' + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
      }
    });
  }
})();
