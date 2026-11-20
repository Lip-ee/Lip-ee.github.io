// Um NPC que anda em cima da barra de status e comenta o que você faz.
// Ele não pensa. É de propósito (como os do GTA 6).

const COLORS = { h: '#c27c4e', s: '#f1c27d', e: '#282a36', p: '#bd93f9', d: '#8e6bd1', j: '#6272a4', b: '#f8f8f2' };

// Virado pra direita. Corpo comum + duas poses de pernas.
const BODY = [
  '...hhhh...',
  '..hhhhhh..',
  '..hhsssh..',
  '..hsssss..',
  '..hssssss.',
  '...ssss...',
  '..pppppp..',
  '.pppdpppp.',
  '.pppdpppp.',
  '.pppdpppp.',
  '.spppppps.',
  '..jjjjjj..',
];
const LEGS_A = ['..jj..jj..', '..jj..jj..', '..jj..jj..', '.bbb..bbb.'];
const LEGS_B = ['..jj.jj...', '.jj...jj..', '.jj....jj.', 'bbb....bbb'];

function pixels(rows, offset = 0) {
  let svg = '';
  rows.forEach((row, i) => {
    for (let x = 0; x < row.length; ) {
      const c = row[x];
      let w = 1;
      while (row[x + w] === c) w++;
      if (c !== '.') svg += `<rect x="${x}" y="${i + offset}" width="${w}" height="1" fill="${COLORS[c]}"/>`;
      x += w;
    }
  });
  return svg;
}

const SPRITE = `<svg viewBox="0 0 10 16" shape-rendering="crispEdges" aria-hidden="true">
  ${pixels(BODY)}<rect class="npc-eye" x="7" y="3" width="1" height="1" fill="${COLORS.e}"/>
  <g class="legs-a">${pixels(LEGS_A, 12)}</g><g class="legs-b">${pixels(LEGS_B, 12)}</g>
</svg>`;

const W = 30; // largura do NPC na tela
const SPEED = 38;
const rand = (min, max) => min + Math.random() * (max - min);
const pick = (list) => list[Math.floor(Math.random() * list.length)];

export function createNpc({ host, lines, onClicks }) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  const el = document.createElement('div');
  el.className = 'npc';
  el.innerHTML = `<button type="button" class="npc-body">${SPRITE}</button>`;
  const bubble = document.createElement('div');
  bubble.className = 'npc-bubble';
  bubble.setAttribute('aria-hidden', 'true');
  const live = document.createElement('div');
  live.className = 'sr-only';
  live.setAttribute('aria-live', 'polite');
  host.append(el, bubble, live);

  const body = el.querySelector('.npc-body');
  let x = 60;
  let target = null;
  let facing = 1;
  let idleUntil = 0;
  let bumpUntil = 0;
  let away = false;
  let leaving = false;
  let talkingUntil = 0;
  let typing = null;
  let clicks = 0;
  let clickTimer = null;
  let last = performance.now();

  const width = () => host.clientWidth;

  function placeBubble() {
    if (!bubble.classList.contains('is-visible')) return;
    const bw = bubble.offsetWidth;
    const left = Math.min(Math.max(x + W / 2 - bw / 2, 8), width() - bw - 8);
    bubble.style.transform = `translateX(${left}px)`;
    bubble.style.setProperty('--tail', `${x + W / 2 - left}px`);
  }

  function say(text, { force = false } = {}) {
    const now = performance.now();
    if (away || (!force && now < talkingUntil)) return;
    clearInterval(typing);
    bubble.textContent = '';
    bubble.classList.add('is-visible');
    live.textContent = text;
    talkingUntil = now + 900 + text.length * 70;
    let i = 0;
    const type = () => {
      bubble.textContent = text.slice(0, ++i);
      placeBubble();
      if (i >= text.length) clearInterval(typing);
    };
    if (reduced.matches) {
      bubble.textContent = text;
      placeBubble();
    } else typing = setInterval(type, 28);
    setTimeout(() => {
      if (performance.now() >= talkingUntil - 5) bubble.classList.remove('is-visible');
    }, talkingUntil - now);
  }

  function setWalking(walking) {
    el.classList.toggle('is-walking', walking);
  }

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const max = width() - W;

    if (target !== null && !reduced.matches) {
      const dir = Math.sign(target - x);
      facing = dir || facing;
      x += dir * SPEED * (leaving ? 4 : 1) * dt;
      // Às vezes ele mira fora da janela e fica andando contra a parede, como todo bom NPC.
      if (x < 0 || x > max) {
        x = Math.min(Math.max(x, 0), max);
        if (leaving) {
          el.classList.add('is-gone');
          away = true;
          target = null;
          setWalking(false);
        } else if (!bumpUntil) {
          bumpUntil = now + 2200;
          say(lines().bump);
        } else if (now > bumpUntil) {
          bumpUntil = 0;
          target = null;
        }
      } else if (Math.abs(target - x) < 2) {
        target = null;
      }
      if (target === null) {
        setWalking(false);
        idleUntil = now + rand(1500, 4500);
      }
    } else if (!away && now > idleUntil && now > talkingUntil) {
      const wall = Math.random() < 0.12;
      target = wall ? (Math.random() < 0.5 ? -200 : max + 200) : rand(0, max);
      setWalking(true);
    }

    x = Math.min(Math.max(x, leaving ? -W : 0), Math.max(max, 0));
    el.style.transform = `translateX(${x}px)`;
    el.classList.toggle('is-left', facing < 0);
    placeBubble();
    requestAnimationFrame(frame);
  }

  function leave() {
    say(lines().bye, { force: true });
    leaving = true;
    el.classList.add('is-leaving');
    setTimeout(() => {
      if (reduced.matches) {
        el.classList.add('is-gone');
        away = true;
        return;
      }
      target = x < width() / 2 ? -500 : width() + 500;
      setWalking(true);
    }, 1200);
  }

  function summon() {
    if (!away) return say(lines().here, { force: true });
    away = false;
    leaving = false;
    el.classList.remove('is-leaving');
    x = 0;
    el.classList.remove('is-gone');
    target = rand(60, width() / 2);
    setWalking(true);
    setTimeout(() => say(lines().back, { force: true }), 600);
  }

  body.addEventListener('click', () => {
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
      const seq = lines().clicks;
      say(seq[Math.min(clicks, seq.length - 1)], { force: true });
      clicks++;
      onClicks(clicks);
    }, 230);
  });
  body.addEventListener('dblclick', () => {
    clearTimeout(clickTimer);
    leave();
  });

  // Fala sozinho de vez em quando.
  setInterval(() => {
    if (!document.hidden && Math.random() < 0.5) say(pick(lines().ambient));
  }, 26000);

  requestAnimationFrame(frame);

  return {
    say,
    summon,
    react(key, { force = false } = {}) {
      const line = lines()[key];
      if (line) say(Array.isArray(line) ? pick(line) : line, { force });
    },
    setLabel(label) {
      body.setAttribute('aria-label', label);
      body.title = label;
    },
  };
}
