# EAD Experiência do Usuário, Tema 06: Mapeamento de Feedbacks

Para abrir, dê dois cliques em `index.html`. Não precisa de servidor.
Para entrar, use qualquer e-mail e uma senha com 6 ou mais caracteres.

## Arquivos

```
index.html              Tela 01: login
cadastro.html           Cadastro simulado
recuperar.html          Recuperação de senha simulada
home.html               Lista dos 10 temas (só o Tema 06 abre)
conteudo.html           Tela 02: áudio e texto do Tema 06, com o menu de seções em um aside
video.html              Vídeoaula
material.html           Download da apostila em PDF
mapa-feedbacks.html     Atividade de classificar situações nas categorias do HEART
quiz.html               Quiz no modelo do quiz de referência
mini-relatorio-ux.html  Mini-relatório de UX (1 página, imprime em A4)
manifest.json           Identidade do app instalável (PWA)
service-worker.js       Cache e uso offline (PWA)
sw-version.txt          Versão e lista de arquivos do cache (PWA)
favicon.ico             Favicon (16, 32 e 48 px)
css/styles.css          Estilos
js/                     storage, common, auth, app, painel, quiz, mapa
assets/js/              pwa-register.js
assets/                 ícones, favicon.svg, fontes, apostila em PDF, audio e video (pastas vazias)
```

## O que você precisa adicionar

Nenhuma mídia foi gerada. Enquanto os arquivos não existirem, as páginas mostram um aviso no lugar do player.

| Arquivo | Onde colocar | Onde aparece |
|---|---|---|
| Áudio | `assets/audio/resumo-tema06.mp3` | `conteudo.html`, acima do texto |
| Vídeoaula | `assets/video/videoaula-tema06.mp4` | `video.html` |
| Legendas (opcional) | `assets/video/legendas.vtt` | `video.html` (descomente a linha `<track>`) |
| Imagens (opcional) | `assets/img/` | comentário `IMAGEM` em `conteudo.html`, sempre com `alt` |

## Material PDF

O arquivo de download é a apostila enviada, em `assets/Apostila_Experiencia_do_Usuario.pdf`. Os links usam o atributo `download`, então o navegador baixa o arquivo.

## Quiz e mapa de feedbacks

As perguntas ficam em `js/quiz.js` e `js/mapa.js`, e o painel em `js/painel.js`. No quiz, a primeira alternativa de cada questão é a correta e o painel embaralha a ordem ao iniciar. O progresso é salvo por e-mail no `localStorage`. Para zerar, limpe o Local Storage no DevTools (aba Application).

## Mini-relatório

`mini-relatorio-ux.html` é uma entrega da atividade. Nenhuma página do site tem link para ele.

## PWA

O site é instalável e abre offline depois da primeira visita. A base é o modelo enviado (`service-worker.js`, `sw-version.txt` e `pwa-register.js`), com estas mudanças:

- Os caminhos são relativos, então funciona na raiz do domínio e em subpasta, como no GitHub Pages.
- Áudio, vídeo e PDF passam direto pela rede e não entram no cache. O cache não guarda respostas parciais (Range), que áudio e vídeo usam.
- O manifest usa `"orientation": "any"`, para o vídeo poder girar a tela no celular.
- Os ícones de máscara (`maskable`) têm arquivos próprios, com a marca dentro da zona segura.

O Service Worker só funciona em `https` ou `localhost`. Abrindo o arquivo direto (`file://`), o site funciona normalmente e o registro é ignorado. Para testar, rode `npx serve .` na pasta do projeto e abra `http://localhost:3000`. Não use a extensão Live Server, pelo motivo explicado no README do modelo.

Sempre que mudar qualquer arquivo do site, suba a versão nos dois lugares: a primeira linha de `sw-version.txt` e a constante `SW_BUILD` de `service-worker.js`. Arquivo novo entra como uma linha nova em `sw-version.txt`. Sem isso, quem já instalou continua vendo a versão antiga.

## Ícones

Os ícones vêm da logo do site (quadrado roxo #4f46e5 com "UX" em Atkinson Hyperlegible Bold), com as mesmas proporções.

| Arquivo | Uso |
|---|---|
| `assets/icon-192.png`, `assets/icon-512.png` | Ícone do app (cantos arredondados, fundo transparente) |
| `assets/icon-maskable-192.png`, `assets/icon-maskable-512.png` | Ícone recortado pelo Android (quadrado inteiro) |
| `assets/apple-touch-icon.png` | Tela inicial do iOS (180 px) |
| `favicon.ico`, `assets/favicon.svg` | Aba do navegador. As letras são maiores para ler em 16 px |

## Limitações

- Login, cadastro e recuperação de senha são simulados. Nada é enviado a um servidor.
- Testado no Chromium (computador e celular emulado) com o axe-core, incluindo a instalação do PWA e o uso offline com o servidor desligado. Não foi testado no Safari, no Firefox nem com leitor de tela real.
- A fonte Atkinson Hyperlegible tem licença OFL, em `assets/fonts/OFL-LICENSE.txt`.
