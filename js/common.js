/* Ano no rodapé e botão de voltar ao topo (todas as páginas). */
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('yearNow');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const topBtn = document.getElementById('backToTop');
  if (topBtn) {
    const toggleTop = () => { topBtn.hidden = window.scrollY < 360; };
    toggleTop();
    window.addEventListener('scroll', toggleTop, { passive: true });
    topBtn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }
});
