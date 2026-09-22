/* ==========================================================================
   Registro do Service Worker — atualização silenciosa e automática.
   Incluir este script em TODAS as páginas HTML do seu site.

   Caminho do <script>: use o caminho relativo até assets/js/pwa-register.js.
   O endereço do service-worker.js é calculado a partir deste arquivo
   (duas pastas acima), então funciona em qualquer profundidade de página.

   O service-worker.js precisa ficar na RAIZ do site (não dentro de
   /assets) para que o escopo dele cubra o site inteiro.

   Comportamento: assim que o navegador detecta uma versão nova do SW
   (o que só acontece quando o arquivo service-worker.js muda, byte a
   byte — lembre de subir SW_BUILD lá dentro a cada deploy), ela é
   instalada e ativada automaticamente, sem perguntar nada ao usuário.
   Não existe aviso na tela. A troca de conteúdo acontece na próxima
   navegação/reload natural do usuário, sem forçar reload no meio do que
   ele estiver fazendo.
   ========================================================================== */

// Service Worker só funciona em https ou localhost. Abrindo o arquivo direto
// (file://), o site funciona normalmente e este script não faz nada.
const SW_URL = document.currentScript
  ? new URL('../../service-worker.js', document.currentScript.src).href
  : 'service-worker.js';
const SW_SCOPE = new URL('./', SW_URL).href;

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(SW_URL, { scope: SW_SCOPE })
      .then((registration) => {
        console.log('[PWA] Service Worker registrado.');

        // Assim que uma versão nova terminar de instalar, ela pode assumir
        // o controle imediatamente — o próprio service-worker.js já chama
        // self.skipWaiting() no install, então isso normalmente já ocorre
        // sozinho. Esse listener é só uma rede de segurança: se por algum
        // motivo o SW ficar em "waiting", mandamos ele assumir mesmo assim,
        // sem esperar clique nenhum.
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              if (registration.waiting) {
                registration.waiting.postMessage('SKIP_WAITING');
              }
            }
          });
        });

        if (registration.waiting) {
          registration.waiting.postMessage('SKIP_WAITING');
        }

        // Checa por atualização de versão a cada 30 minutos, além da
        // checagem automática que o navegador já faz sozinho.
        setInterval(() => registration.update(), 30 * 60 * 1000);
      })
      .catch((err) => {
        console.warn('[PWA] Falha ao registrar Service Worker:', err);
      });

    // Quando o novo SW assume o controle, o conteúdo em cache já mudou.
    // Não recarregamos a página no ato — isso evitaria interromper o
    // usuário no meio de algo. A versão nova passa a valer sozinha na
    // próxima navegação (troca de página, próximo reload natural).
  });
}
