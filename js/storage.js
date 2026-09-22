/* Armazenamento simples (demonstração). Nenhum dado sai do navegador.
   Se o localStorage estiver bloqueado, usa window.name como reserva
   para a sessão não se perder entre as páginas. */
(function () {
  var SESSION_KEY = 'ead_ux_user';

  var usable = (function () {
    try {
      localStorage.setItem('__ead_test', '1');
      localStorage.removeItem('__ead_test');
      return true;
    } catch (e) { return false; }
  })();

  function readName() {
    try { return JSON.parse(window.name || '{}') || {}; } catch (e) { return {}; }
  }
  function writeName(o) {
    try { window.name = JSON.stringify(o); } catch (e) { /* ignora */ }
  }

  var Store = {
    get: function (k) {
      if (usable) { try { return localStorage.getItem(k); } catch (e) { /* usa a reserva */ } }
      var o = readName();
      return o[k] == null ? null : o[k];
    },
    set: function (k, v) {
      if (usable) { try { localStorage.setItem(k, v); return; } catch (e) { /* usa a reserva */ } }
      var o = readName(); o[k] = v; writeName(o);
    },
    remove: function (k) {
      if (usable) { try { localStorage.removeItem(k); return; } catch (e) { /* usa a reserva */ } }
      var o = readName(); delete o[k]; writeName(o);
    }
  };

  function getUser() {
    var raw = Store.get(SESSION_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }
  function setUser(u) { Store.set(SESSION_KEY, JSON.stringify(u)); }
  function logout() { Store.remove(SESSION_KEY); }
  function displayName(u) {
    var n = (u && (u.nome || (u.email || '').split('@')[0])) || 'Aluno';
    return n.charAt(0).toUpperCase() + n.slice(1);
  }

  window.EAD = { Store: Store, getUser: getUser, setUser: setUser, logout: logout, displayName: displayName };
})();
