// Tela inicial do videogame, no estilo do PlayStation: escolhe o jogo e ele abre numa aba nova.
// Funciona com mouse, toque, teclado e controle (via gamepad.js).

import { CONSOLE_ITEMS } from './content.js';

const img = (id, kind) => `assets/games/${id}-${kind}.jpg`;

export function createConsoleHud({ root, lang, ui, onBack, onPlay }) {
  const $ = (s) => root.querySelector(s);
  const tiles = $('#ps-tiles');
  const play = $('#ps-play');
  const note = $('#ps-note');
  let selected = 0;
  let clock = null;

  // Pré-carrega os fundos pra troca de jogo não piscar.
  for (const it of CONSOLE_ITEMS) new Image().src = img(it.id, 'hero');

  const text = (it) => it[lang()];

  function renderTiles() {
    tiles.innerHTML = CONSOLE_ITEMS.map((it, i) => `<li>
      <a class="ps-tile" href="${it.url}" target="_blank" rel="noopener" data-index="${i}"${it.game ? ' data-game' : ''}
         style="background-image:url(${img(it.id, 'tile')})" aria-label="${text(it).title}"></a>
      <span class="ps-tile-name" aria-hidden="true">${text(it).title}</span>
    </li>`).join('');
  }

  function select(i, { focus = false } = {}) {
    selected = (i + CONSOLE_ITEMS.length) % CONSOLE_ITEMS.length;
    const it = CONSOLE_ITEMS[selected];
    const t = text(it);
    tiles.querySelectorAll('li').forEach((li, j) => li.classList.toggle('is-selected', j === selected));
    $('#ps-bg').style.backgroundImage = `url(${img(it.id, 'hero')})`;
    $('#ps-title').textContent = t.title;
    $('#ps-meta').textContent = t.meta;
    $('#ps-desc').textContent = t.desc;
    const label = it.game ? ui().psPlay : ui().psWatch;
    play.textContent = label;
    $('#ps-hint-play').textContent = label;
    play.href = it.url;
    play.toggleAttribute('data-game', Boolean(it.game));
    // o Debugando fica na aba "Mídia", como os apps de vídeo do console
    $('#ps-tab-games').classList.toggle('is-active', Boolean(it.game));
    $('#ps-tab-media').classList.toggle('is-active', !it.game);
    note.hidden = true;
    if (focus) tiles.querySelectorAll('.ps-tile')[selected].focus();
  }

  // ✕ no controle. Navegadores podem bloquear abas abertas pelo controle (não conta como clique);
  // nesse caso avisamos e deixamos o botão focado, pra um Enter ou clique resolver.
  function launch() {
    const it = CONSOLE_ITEMS[selected];
    const tab = window.open(it.url, '_blank');
    if (tab) {
      tab.opener = null;
      onPlay(it);
    } else {
      note.textContent = ui().psBlocked;
      note.hidden = false;
      play.focus();
    }
  }

  function tick() {
    $('#ps-clock').textContent = new Date().toLocaleTimeString(ui().htmlLang, { hour: '2-digit', minute: '2-digit' });
  }

  tiles.addEventListener('pointerover', (e) => {
    const tile = e.target.closest('.ps-tile');
    if (tile) select(Number(tile.dataset.index));
  });
  tiles.addEventListener('focusin', (e) => {
    const tile = e.target.closest('.ps-tile');
    if (tile && Number(tile.dataset.index) !== selected) select(Number(tile.dataset.index));
  });
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') select(selected + 1, { focus: true });
    else if (e.key === 'ArrowLeft') select(selected - 1, { focus: true });
    else if (e.key === 'Escape' || e.key === 'Backspace') onBack();
    else return;
    e.preventDefault();
  });
  $('#ps-back').addEventListener('click', onBack);

  return {
    isOpen: () => !root.hidden,
    open() {
      renderTiles();
      root.hidden = false;
      requestAnimationFrame(() => root.classList.add('is-open'));
      select(selected, { focus: true });
      tick();
      clock = setInterval(tick, 20000);
    },
    close() {
      root.classList.remove('is-open');
      clearInterval(clock);
      setTimeout(() => (root.hidden = true), 300);
    },
    // Botões do controle
    press(button) {
      if (button === 'left') select(selected - 1, { focus: true });
      else if (button === 'right') select(selected + 1, { focus: true });
      else if (button === 'a') launch();
      else if (button === 'b') onBack();
    },
    relabel() {
      if (root.hidden) return;
      renderTiles();
      select(selected);
      tick();
    },
  };
}
