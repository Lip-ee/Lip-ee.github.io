// Conquistas estilo Xbox/Steam: ficam salvas no navegador de quem visita.

import { ACHIEVEMENTS } from './content.js';
import { escapeHTML } from './highlight.js';

const KEY = 'achievements';
const byId = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a]));
const required = ACHIEVEMENTS.filter((a) => !a.secret && !a.platinum).map((a) => a.id);

function load() {
  try {
    return new Map(JSON.parse(localStorage.getItem(KEY)) || []);
  } catch {
    return new Map();
  }
}

export function createAchievements({ popup, ui, lang, onChange }) {
  const unlocked = load();
  const queue = [];
  let showing = false;

  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify([...unlocked]));
    } catch {
      /* sem localStorage: as conquistas valem só nesta visita */
    }
  };

  const text = (a) => a[lang()];

  // Animação do Xbox 360: o círculo surge, abre virando pílula, segura e fecha.
  function next() {
    if (showing || !queue.length) return;
    showing = true;
    const a = byId[queue.shift()];
    const [title] = text(a);
    popup.innerHTML = `<div class="trophy-pill${a.platinum ? ' is-platinum' : ''}">
      <span class="trophy-pill-icon" aria-hidden="true">${a.icon}</span>
      <span class="trophy-pill-text"><small>${escapeHTML(ui().achievementUnlocked)}</small><strong>${escapeHTML(title)}</strong></span>
    </div>`;
    const pill = popup.firstElementChild;
    const steps = [
      [30, 'is-in'],
      [380, 'is-open'],
      [4200, '-is-open'],
      [4650, '-is-in'],
    ];
    for (const [delay, cls] of steps) {
      setTimeout(() => (cls[0] === '-' ? pill.classList.remove(cls.slice(1)) : pill.classList.add(cls)), delay);
    }
    setTimeout(() => {
      showing = false;
      next();
    }, 5050);
  }

  function unlock(id) {
    if (!byId[id] || unlocked.has(id)) return;
    unlocked.set(id, Date.now());
    save();
    queue.push(id);
    next();
    if (!unlocked.has('platinum') && required.every((r) => unlocked.has(r))) unlock('platinum');
    onChange();
  }

  const progress = () => ({ done: unlocked.size, total: ACHIEVEMENTS.length });

  function render() {
    const { done, total } = progress();
    const pct = Math.round((done / total) * 100);
    const t = ui();
    const cards = ACHIEVEMENTS.map((a) => {
      const got = unlocked.has(a.id);
      const hidden = a.secret && !got;
      const [title, desc] = hidden ? [t.secretTitle, t.secretText] : text(a);
      const cls = ['trophy-card', got ? 'is-unlocked' : 'is-locked', a.platinum ? 'is-platinum' : ''].join(' ').trim();
      return `<li class="${cls}">
        <span class="trophy-card-icon" aria-hidden="true">${hidden ? '?' : a.icon}</span>
        <span class="trophy-card-text"><strong>${escapeHTML(title)}</strong><span>${escapeHTML(desc)}</span></span>
        <span class="trophy-card-state">${got ? '✓' : '🔒'}<span class="sr-only">${got ? t.unlocked : t.locked}</span></span>
      </li>`;
    }).join('');
    return `<div class="trophies">
      <header class="trophies-head">
        <div class="trophies-ring" style="--p:${pct}" aria-hidden="true"><span>${pct}%</span></div>
        <div><h2>${escapeHTML(t.achievements)}</h2><p>${escapeHTML(t.achievementsProgress(done, total))}</p></div>
      </header>
      <ul class="trophies-grid">${cards}</ul>
    </div>`;
  }

  return { unlock, progress, render };
}
