// Bugs em pixel art que andam por cima do código. Clique (ou toque) pra esmagar.

const COLORS = { r: '#ff5555', d: '#9c2433', h: '#ffb86c', a: '#ffd0a8' };

// Visto de cima, olhando pra cima. Cada caractere é um pixel.
const BODY = [
  '..a......a..',
  '...a....a...',
  '....hhhh....',
  '...hhhhhh...',
  '..rrrddrrr..',
  '.rdrrddrrdr.',
  '.rrrrddrrrr.',
  '.rrrrddrrrr.',
  '.rdrrddrrdr.',
  '..rrrddrrr..',
  '...rrrrrr...',
];

const SPLAT = [
  '..r.....r...',
  '...r..r..r..',
  '.r..rrrr....',
  '...rrddrr.r.',
  'r.rrdrrdrr..',
  '..rdrrrrdrr.',
  '.rrdrrrdrr.r',
  '..rrddrrr...',
  'r..rrrr..r..',
  '..r..r...r..',
  '.....r......',
];

// Duas poses das pernas, alternadas enquanto o bug anda (espelhadas dos dois lados).
const LEGS_A = [[0, 3], [1, 4], [0, 6], [0, 7], [1, 9], [0, 10]];
const LEGS_B = [[0, 2], [1, 3], [0, 5], [0, 8], [0, 9], [1, 10]];

function pixels(rows) {
  let svg = '';
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; ) {
      const c = row[x];
      let w = 1;
      while (row[x + w] === c) w++;
      if (c !== '.') svg += `<rect x="${x}" y="${y}" width="${w}" height="1" fill="${COLORS[c]}"/>`;
      x += w;
    }
  });
  return svg;
}

const legs = (points) =>
  points
    .flatMap(([x, y]) => [[x, y], [11 - x, y]])
    .map(([x, y]) => `<rect x="${x}" y="${y}" width="1" height="1" fill="${COLORS.a}"/>`)
    .join('');

const svg = (inner) => `<svg viewBox="0 0 12 11" shape-rendering="crispEdges" aria-hidden="true">${inner}</svg>`;
const SPRITE = svg(`${pixels(BODY)}<g class="legs-a">${legs(LEGS_A)}</g><g class="legs-b">${legs(LEGS_B)}</g>`);
const SPLAT_SPRITE = svg(pixels(SPLAT));

const SPEED = 55; // px/s
const HALF = 18; // metade da área de clique
const rand = (min, max) => min + Math.random() * (max - min);

export function createBugs({ layer, onSquash }) {
  const bugs = new Set();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let running = false;
  let last = 0;

  const place = (b) => {
    b.el.style.transform = `translate(${b.x - HALF}px, ${b.y - HALF}px) rotate(${b.angle + Math.PI / 2}rad)`;
  };

  function setWalking(b, walking) {
    b.walking = walking;
    b.timer = walking ? rand(1.2, 3.5) : rand(0.4, 1.8);
    b.el.classList.toggle('is-walking', walking);
  }

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const w = layer.clientWidth;
    const h = layer.clientHeight;
    for (const b of bugs) {
      b.timer -= dt;
      if (b.timer <= 0) {
        setWalking(b, !b.walking);
        if (b.walking) b.angle += rand(-1.4, 1.4);
      }
      if (b.walking) {
        b.angle += rand(-2.5, 2.5) * dt;
        b.x += Math.cos(b.angle) * SPEED * dt;
        b.y += Math.sin(b.angle) * SPEED * dt;
        // Bate na borda e volta, como um inseto de verdade numa caixa.
        if (b.x < HALF || b.x > w - HALF) {
          b.x = Math.min(Math.max(b.x, HALF), w - HALF);
          b.angle = Math.PI - b.angle;
        }
        if (b.y < HALF || b.y > h - HALF) {
          b.y = Math.min(Math.max(b.y, HALF), h - HALF);
          b.angle = -b.angle;
        }
      }
      place(b);
    }
    if (bugs.size) requestAnimationFrame(frame);
    else running = false;
  }

  function start() {
    if (running || reduced.matches) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(frame);
  }

  function squash(b) {
    if (!bugs.delete(b)) return;
    b.el.classList.remove('is-walking');
    b.el.classList.add('is-squashed');
    b.el.innerHTML = SPLAT_SPRITE;
    setTimeout(() => b.el.remove(), 1600);
    onSquash(bugs.size);
  }

  function spawn() {
    const w = layer.clientWidth;
    const h = layer.clientHeight;
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'bug';
    el.tabIndex = -1;
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = SPRITE;

    // Nasce numa borda e entra andando em direção ao meio.
    const edge = Math.floor(Math.random() * 4);
    const x = reduced.matches ? rand(HALF, w - HALF) : edge === 1 ? w - HALF : edge === 3 ? HALF : rand(HALF, w - HALF);
    const y = reduced.matches ? rand(HALF, h - HALF) : edge === 0 ? HALF : edge === 2 ? h - HALF : rand(HALF, h - HALF);
    const b = { el, x, y, angle: Math.atan2(h / 2 - y, w / 2 - x) + rand(-0.5, 0.5) };

    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      squash(b);
    });
    setWalking(b, true);
    place(b);
    layer.append(el);
    bugs.add(b);
    start();
  }

  return { spawn, alive: () => bugs.size };
}
