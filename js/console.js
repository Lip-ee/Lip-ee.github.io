// Tela inicial do videogame, no estilo do PlayStation: escolhe o jogo e ele abre numa aba nova.

import { CONSOLE_ITEMS } from './content.js';

const MONO = '"JetBrains Mono", ui-monospace, monospace';

/* ---------- Artes (desenhadas em canvas, servem pro bloco e pro fundo) ---------- */

const BUG = ['..a......a..', '...a....a...', '....hhhh....', '...hhhhhh...', '..rrrddrrr..', '.rdrrddrrdr.', '.rrrrddrrrr.', '.rrrrddrrrr.', '.rdrrddrrdr.', '..rrrddrrr..', '...rrrrrr...'];
const BUG_COLORS = { r: '#ff5555', d: '#9c2433', h: '#ffb86c', a: '#ffd0a8' };

function stars(ctx, w, h, n, maxY = 1) {
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.random() * 0.7})`;
    ctx.fillRect(Math.random() * w, Math.random() * h * maxY, 2, 2);
  }
}

const ART = {
  deploy(ctx, w, h) {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#140f33');
    g.addColorStop(0.65, '#5b2a6e');
    g.addColorStop(1, '#ff6b3d');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    stars(ctx, w, h, 70, 0.5);
    let x = 0;
    while (x < w) {
      const bw = w * (0.06 + Math.random() * 0.08);
      const bh = h * (0.15 + Math.random() * 0.28);
      ctx.fillStyle = '#0e0a20';
      ctx.fillRect(x, h - bh, bw, bh);
      for (let wy = h - bh + 8; wy < h - 6; wy += 14) {
        for (let wx = x + 5; wx < x + bw - 6; wx += 11) {
          if (Math.random() < 0.3) {
            ctx.fillStyle = '#ffd27a';
            ctx.fillRect(wx, wy, 5, 7);
          }
        }
      }
      x += bw + 3;
    }
    const size = Math.round(Math.min(w, h) / 20);
    const bx = w * (w > h ? 0.68 : 0.5) - 6 * size;
    const by = h * 0.36 - 5.5 * size;
    BUG.forEach((row, j) => [...row].forEach((c, i) => {
      if (c === '.') return;
      ctx.fillStyle = BUG_COLORS[c];
      ctx.fillRect(bx + i * size, by + j * size, size, size);
    }));
    ctx.font = `bold ${Math.round(Math.min(w, h) / 9)}px ${MONO}`;
    ctx.fillStyle = 'rgba(255,224,138,0.9)';
    ctx.textAlign = 'center';
    ctx.fillText('17:58', w * (w > h ? 0.68 : 0.5), h * 0.36 + 7 * size);
  },
  mars(ctx, w, h) {
    ctx.fillStyle = '#07071a';
    ctx.fillRect(0, 0, w, h);
    stars(ctx, w, h, 120);
    const r = Math.min(w, h) * 0.36;
    const cx = w * (w > h ? 0.7 : 0.5);
    const cy = h * 0.52;
    const g = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, r * 0.1, cx, cy, r);
    g.addColorStop(0, '#ffab73');
    g.addColorStop(0.7, '#c4502a');
    g.addColorStop(1, '#6e2412');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(110,36,18,0.45)';
    for (const [dx, dy, s] of [[-0.3, 0.1, 0.16], [0.25, -0.25, 0.1], [0.15, 0.35, 0.12], [-0.05, -0.45, 0.07]]) {
      ctx.beginPath();
      ctx.arc(cx + dx * r, cy + dy * r, s * r, 0, Math.PI * 2);
      ctx.fill();
    }
    // a base do Mike: duas cúpulas no horizonte do planeta
    ctx.fillStyle = 'rgba(220,240,255,0.85)';
    for (const dx of [-0.12, 0.08]) {
      ctx.beginPath();
      ctx.arc(cx + dx * r, cy - r * 0.97, r * 0.07, Math.PI, 0);
      ctx.fill();
    }
  },
  debugando(ctx, w, h) {
    const g = ctx.createRadialGradient(w * 0.5, h * 0.45, 10, w * 0.5, h * 0.5, Math.max(w, h) * 0.7);
    g.addColorStop(0, '#3d1f63');
    g.addColorStop(1, '#0d0b16');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    const bw = Math.min(w, h) * 0.42;
    const bh = bw * 0.7;
    const cx = w * (w > h ? 0.68 : 0.5);
    const cy = h * 0.47;
    ctx.fillStyle = '#ff0033';
    ctx.beginPath();
    ctx.roundRect(cx - bw / 2, cy - bh / 2, bw, bh, bh * 0.28);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(cx - bw * 0.12, cy - bh * 0.24);
    ctx.lineTo(cx - bw * 0.12, cy + bh * 0.24);
    ctx.lineTo(cx + bw * 0.18, cy);
    ctx.fill();
  },
};

function artURL(id, w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  ART[id](canvas.getContext('2d'), w, h);
  return canvas.toDataURL('image/jpeg', 0.85);
}

/* ---------- Tela ---------- */

export function createConsoleHud({ root, lang, ui, onBack }) {
  const $ = (s) => root.querySelector(s);
  const tiles = $('#ps-tiles');
  const bg = $('#ps-bg');
  const play = $('#ps-play');
  const art = Object.fromEntries(CONSOLE_ITEMS.map((it) => [it.id, { tile: artURL(it.art, 320, 320), hero: artURL(it.art, 1280, 720) }]));
  let selected = 0;
  let clock = null;

  const text = (it) => it[lang()];

  function renderTiles() {
    tiles.innerHTML = CONSOLE_ITEMS.map((it, i) => `<li>
      <a class="ps-tile" href="${it.url}" target="_blank" rel="noopener" data-index="${i}"${it.game ? ' data-game' : ''}
         style="background-image:url(${art[it.id].tile})" aria-label="${text(it).title}"></a>
      <span class="ps-tile-name" aria-hidden="true">${text(it).title}</span>
    </li>`).join('');
  }

  function select(i, { focus = false } = {}) {
    selected = (i + CONSOLE_ITEMS.length) % CONSOLE_ITEMS.length;
    const it = CONSOLE_ITEMS[selected];
    const t = text(it);
    tiles.querySelectorAll('li').forEach((li, j) => li.classList.toggle('is-selected', j === selected));
    bg.style.backgroundImage = `url(${art[it.id].hero})`;
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
    if (focus) tiles.querySelectorAll('.ps-tile')[selected].focus();
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
    if (tile) select(Number(tile.dataset.index));
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
    relabel() {
      if (root.hidden) return;
      renderTiles();
      select(selected);
      tick();
    },
  };
}
