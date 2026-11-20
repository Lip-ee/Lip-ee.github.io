// O quarto em 3D onde o site abre. Computador → portfolio, TV → Debugando, caixas dos jogos → aba nova.
// Móveis: Furniture Kit do Kenney (CC0). Monitores, PC, TV e console são montados aqui, em low poly.

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

const MODELS = [
  'floorFull', 'wall', 'wallWindow', 'desk', 'chairDesk', 'computerKeyboard', 'computerMouse', 'cabinetTelevision',
  'rugRound', 'lampRoundFloor', 'pottedPlant', 'bookcaseOpenLow', 'books', 'speakerSmall',
];
const K = 2; // os modelos do Kenney estão em ~1:2; com isso 1 unidade = 1 metro
const UPLOADS = 'UUmAKwgC87-_oe1J3BfDS15g'; // playlist de uploads do Debugando: sempre começa no vídeo mais novo
const MONITOR = { w: 0.531, h: 0.299 }; // tela de 24" 16:9, em metros

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/* ---------- Texturas desenhadas em canvas ---------- */

function canvasTexture(w, h, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  draw(ctx, w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return { tex, ctx, canvas };
}

const MONO = '"JetBrains Mono", ui-monospace, monospace';

function drawEditor(ctx, w, h) {
  ctx.fillStyle = '#282a36';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#21222c';
  ctx.fillRect(0, 0, w, 34);
  ctx.fillRect(0, 34, 190, h);
  ['#28c840', '#febc2e', '#ff5f57'].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(w - 70 + i * 22, 17, 7, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.font = `15px ${MONO}`;
  ['experiencia', '  liderhub.ts', 'projetos', '  debugando.yml', '  deploy-de-sexta.gd', '  mike-on-mars.gd', 'contato.sh', 'sobre.md'].forEach((f, i) => {
    ctx.fillStyle = i === 7 ? '#f8f8f2' : '#a3a8c3';
    if (i === 7) {
      ctx.fillStyle = '#44475a';
      ctx.fillRect(0, 62 + i * 30, 190, 28);
      ctx.fillStyle = '#f8f8f2';
    }
    ctx.fillText(f, 18, 82 + i * 30);
  });
  ctx.fillStyle = '#ff79c6';
  ctx.fillRect(190, 34, 130, 3);
  ctx.fillStyle = '#f8f8f2';
  ctx.fillText('sobre.md', 214, 60);
  // Cada linha: lista de [cor, texto]; a primeira pode trazer uma fonte maior.
  const lines = [
    [['#bd93f9', '# Filipe Campos', 'bold 24px']],
    [],
    [['#f1fa8c', '> Dev na LíderHub e criador do Debugando.']],
    [],
    [['#f8f8f2', 'Sou dev na LíderHub: desenvolvo features']],
    [['#f8f8f2', 'da plataforma e investigo bug em produção.']],
    [],
    [['#ff79c6', '- '], ['#f8f8f2', 'medi quanto um shader trava o jogo']],
    [['#ff79c6', '- '], ['#f8f8f2', 'escrevi uma Flórida inteira por sorteio']],
    [['#ff79c6', '- '], ['#f8f8f2', 'coloquei o Doom pra rodar no navegador']],
    [],
    [['#bd93f9', '## O que tem aqui', 'bold 18px']],
    [['#ff79c6', '- ['], ['#ff79c6', 'projetos/mike-on-mars.gd'], ['#8be9fd', '](#/mike-on-mars)']],
  ];
  lines.forEach((parts, i) => {
    const y = 104 + i * 32;
    ctx.font = `16px ${MONO}`;
    ctx.fillStyle = '#6c7396';
    ctx.fillText(String(i + 1).padStart(2, ' '), 210, y);
    let x = 250;
    for (const [color, text, font = '16px'] of parts) {
      ctx.font = `${font} ${MONO}`;
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
      x += ctx.measureText(text).width;
    }
  });
  ctx.fillStyle = '#191a21';
  ctx.fillRect(0, h - 24, w, 24);
}

function drawStudio(ctx, w, h) {
  ctx.fillStyle = '#1d1e27';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#ff0033';
  ctx.beginPath();
  ctx.roundRect(28, 24, 46, 32, 9);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(45, 31);
  ctx.lineTo(45, 49);
  ctx.lineTo(60, 40);
  ctx.fill();
  ctx.font = `bold 26px ${MONO}`;
  ctx.fillStyle = '#f8f8f2';
  ctx.fillText('Debugando', 88, 50);
  ctx.font = `16px ${MONO}`;
  ctx.fillStyle = '#a3a8c3';
  ctx.fillText('visualizações', 30, 98);
  ctx.font = `bold 46px ${MONO}`;
  ctx.fillStyle = '#50fa7b';
  ctx.fillText('▲ subindo', 30, 150);
  // gráfico subindo
  const pts = [0.92, 0.9, 0.86, 0.88, 0.8, 0.74, 0.77, 0.6, 0.52, 0.55, 0.38, 0.3, 0.18, 0.1];
  const gx = 30, gy = 190, gw = w - 60, gh = h - 230;
  const grad = ctx.createLinearGradient(0, gy, 0, gy + gh);
  grad.addColorStop(0, 'rgba(80,250,123,0.45)');
  grad.addColorStop(1, 'rgba(80,250,123,0)');
  ctx.beginPath();
  pts.forEach((p, i) => ctx.lineTo(gx + (i / (pts.length - 1)) * gw, gy + p * gh));
  ctx.lineTo(gx + gw, gy + gh);
  ctx.lineTo(gx, gy + gh);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.beginPath();
  pts.forEach((p, i) => ctx.lineTo(gx + (i / (pts.length - 1)) * gw, gy + p * gh));
  ctx.strokeStyle = '#50fa7b';
  ctx.lineWidth = 5;
  ctx.stroke();
}

const LOG = [
  ['#6c7396', '$ npm run debug -- --jogo gta6'],
  ['#8be9fd', 'carregando shaders...'],
  ['#50fa7b', '✓ shader compilado em 2.3 ms'],
  ['#f1fa8c', '⚠ queda de frame: 41 → 23 fps'],
  ['#ff79c6', '▶ medindo NPC #4021'],
  ['#ff5555', '✗ NPC não pensa (esperado)'],
  ['#8be9fd', 'gerando Flórida por sorteio...'],
  ['#50fa7b', '✓ 12.400 km² gerados'],
  ['#6c7396', '$ doom --navegador'],
  ['#50fa7b', '✓ E1M1 rodando a 60 fps'],
  ['#f1fa8c', '⚠ deploy na sexta detectado'],
  ['#ff5555', '✗ abortado por segurança'],
  ['#6c7396', '$ git commit -m "roteiro"'],
  ['#50fa7b', '✓ vídeo novo no forno'],
];

function drawTerminal(ctx, w, h, offset) {
  ctx.fillStyle = '#191a21';
  ctx.fillRect(0, 0, w, h);
  ctx.font = `bold 20px ${MONO}`;
  ctx.fillStyle = '#bd93f9';
  ctx.fillText('debug.log', 24, 40);
  ctx.font = `17px ${MONO}`;
  const rows = Math.floor((h - 80) / 30);
  for (let i = 0; i < rows; i++) {
    const [color, text] = LOG[(offset + i) % LOG.length];
    ctx.fillStyle = color;
    ctx.fillText(text.slice(0, 34), 24, 84 + i * 30);
  }
  ctx.fillStyle = '#f8f8f2';
  ctx.fillRect(24, 84 + rows * 30 - 18, 11, 22);
}

function drawSky(ctx, w, h) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#0b0820');
  g.addColorStop(0.6, '#2a1650');
  g.addColorStop(1, '#5a2a6e');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 90; i++) {
    ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.random() * 0.7})`;
    ctx.fillRect(Math.random() * w, Math.random() * h * 0.6, 2, 2);
  }
  ctx.fillStyle = '#f8f4d8';
  ctx.beginPath();
  ctx.arc(w * 0.72, h * 0.22, 34, 0, Math.PI * 2);
  ctx.fill();
  // prédios com janelas acesas
  let x = 0;
  while (x < w) {
    const bw = 40 + Math.random() * 60;
    const bh = h * (0.18 + Math.random() * 0.3);
    ctx.fillStyle = '#120c26';
    ctx.fillRect(x, h - bh, bw, bh);
    for (let wy = h - bh + 10; wy < h - 8; wy += 16) {
      for (let wx = x + 7; wx < x + bw - 8; wx += 13) {
        if (Math.random() < 0.35) {
          ctx.fillStyle = Math.random() < 0.8 ? '#ffd27a' : '#8be9fd';
          ctx.fillRect(wx, wy, 6, 8);
        }
      }
    }
    x += bw + 4;
  }
}

function pixelBug(ctx, x, y, size) {
  const map = ['..a......a..', '...a....a...', '....hhhh....', '...hhhhhh...', '..rrrddrrr..', '.rdrrddrrdr.', '.rrrrddrrrr.', '.rrrrddrrrr.', '.rdrrddrrdr.', '..rrrddrrr..', '...rrrrrr...'];
  const colors = { r: '#ff5555', d: '#9c2433', h: '#ffb86c', a: '#ffd0a8' };
  map.forEach((row, j) => [...row].forEach((c, i) => {
    if (c === '.') return;
    ctx.fillStyle = colors[c];
    ctx.fillRect(x + i * size, y + j * size, size, size);
  }));
}

function drawDeployCover(ctx, w, h) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#1b1440');
  g.addColorStop(1, '#ff6b3d');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#0e0e14';
  ctx.fillRect(0, 0, w, 34);
  ctx.font = `bold 15px ${MONO}`;
  ctx.fillStyle = '#f8f8f2';
  ctx.fillText('GAME', 14, 23);
  pixelBug(ctx, w / 2 - 72, 70, 12);
  ctx.font = `bold 34px ${MONO}`;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';
  ctx.fillText('DEPLOY', w / 2, h - 110);
  ctx.fillText('DE SEXTA', w / 2, h - 70);
  ctx.font = `bold 18px ${MONO}`;
  ctx.fillStyle = '#ffe08a';
  ctx.fillText('sexta, 17:58', w / 2, h - 32);
  ctx.textAlign = 'left';
}

function drawMarsCover(ctx, w, h) {
  ctx.fillStyle = '#0b0b1e';
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 60; i++) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
  }
  const g = ctx.createRadialGradient(w * 0.42, h * 0.42, 10, w / 2, h / 2, 120);
  g.addColorStop(0, '#ff9a5c');
  g.addColorStop(1, '#a63a1e');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(w / 2, h / 2 - 10, 105, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0e0e14';
  ctx.fillRect(0, 0, w, 34);
  ctx.font = `bold 15px ${MONO}`;
  ctx.fillStyle = '#f8f8f2';
  ctx.fillText('GAME', 14, 23);
  ctx.font = `bold 34px ${MONO}`;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';
  ctx.fillText('MIKE', w / 2, h - 110);
  ctx.fillText('ON MARS', w / 2, h - 70);
  ctx.font = `bold 15px ${MONO}`;
  ctx.fillStyle = '#8be9fd';
  ctx.fillText('NASA Space Apps', w / 2, h - 32);
  ctx.textAlign = 'left';
}

function drawPoster(ctx, w, h) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, '#2b1b4a');
  g.addColorStop(1, '#16121f');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#ff0033';
  ctx.beginPath();
  ctx.roundRect(w / 2 - 90, 110, 180, 126, 34);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(w / 2 - 26, 140);
  ctx.lineTo(w / 2 - 26, 206);
  ctx.lineTo(w / 2 + 34, 173);
  ctx.fill();
  ctx.textAlign = 'center';
  ctx.font = `bold 52px ${MONO}`;
  ctx.fillStyle = '#f8f8f2';
  ctx.fillText('DEBUGANDO', w / 2, 330);
  ctx.font = `22px ${MONO}`;
  ctx.fillStyle = '#ff79c6';
  ctx.fillText('games por dentro', w / 2, 375);
  ctx.fillText('com código de verdade', w / 2, 405);
  ctx.textAlign = 'left';
}

function drawWallPoster(ctx, w, h) {
  ctx.fillStyle = '#1a1b24';
  ctx.fillRect(0, 0, w, h);
  ctx.font = `bold 30px ${MONO}`;
  ctx.fillStyle = '#50fa7b';
  ctx.fillText('while (vivo) {', 28, 66);
  ctx.fillStyle = '#f8f8f2';
  ctx.fillText('  codar();', 28, 116);
  ctx.fillText('  explicar();', 28, 160);
  ctx.fillStyle = '#50fa7b';
  ctx.fillText('}', 28, 206);
}

/* ---------- Peças montadas à mão ---------- */

const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.6, ...extra });

function box(w, h, d, material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

function screenMesh(w, h, tex) {
  const material = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, color: 0x000000 });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material);
  m.position.z = 0.0155;
  return m;
}

function monitor(tex, portrait = false) {
  const g = new THREE.Group();
  const [w, h] = portrait ? [MONITOR.h, MONITOR.w] : [MONITOR.w, MONITOR.h];
  g.add(box(w + 0.02, h + 0.02, 0.03, mat(0x15161c, { roughness: 0.4 })));
  const screen = screenMesh(w, h, tex);
  g.add(screen);
  g.add(box(0.1, 0.1, 0.04, mat(0x15161c), 0, 0, -0.035));
  return { group: g, screen, w: w + 0.02, h: h + 0.02 };
}

function aquariumPc() {
  const g = new THREE.Group();
  const W = 0.27, H = 0.47, D = 0.44;
  const frame = mat(0x101117, { roughness: 0.35, metalness: 0.6 });
  g.add(box(W, 0.02, D, frame, 0, 0.01, 0));
  g.add(box(W, 0.02, D, frame, 0, H - 0.01, 0));
  g.add(box(0.015, H, D, frame, -W / 2 + 0.0075, H / 2, 0)); // lateral de trás (placa-mãe)
  g.add(box(W, H, 0.015, frame, 0, H / 2, -D / 2 + 0.0075)); // traseira
  g.add(box(0.012, H, 0.012, frame, W / 2 - 0.006, H / 2, D / 2 - 0.006)); // coluna da quina de vidro
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x9fb8ff, transparent: true, opacity: 0.12, roughness: 0.05, metalness: 0, depthWrite: false });
  const front = new THREE.Mesh(new THREE.PlaneGeometry(W, H), glass);
  front.position.set(0, H / 2, D / 2);
  const side = new THREE.Mesh(new THREE.PlaneGeometry(D, H), glass);
  side.position.set(W / 2, H / 2, 0);
  side.rotation.y = Math.PI / 2;
  g.add(front, side);

  // Por dentro: placa-mãe, placa de vídeo, memórias e ventoinhas, tudo com RGB.
  g.add(box(0.01, H * 0.8, D * 0.7, mat(0x1c2230), -W / 2 + 0.02, H * 0.55, -0.02));
  const rgb = [];
  const glow = (hueOffset) => {
    const m = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0xffffff, emissiveIntensity: 2.2, roughness: 0.4 });
    rgb.push({ m, hueOffset });
    return m;
  };
  g.add(box(0.13, 0.04, 0.3, mat(0x22252f, { metalness: 0.5 }), -0.06, H * 0.42, 0)); // GPU
  g.add(box(0.005, 0.012, 0.28, glow(0.1), 0.007, H * 0.42, 0));
  for (let i = 0; i < 4; i++) g.add(box(0.008, 0.06, 0.01, glow(0.05 * i), -W / 2 + 0.035, H * 0.7, -0.05 + i * 0.022));
  const cooler = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.006, 8, 24), glow(0.3));
  cooler.position.set(-W / 2 + 0.035, H * 0.62, 0.06);
  cooler.rotation.y = Math.PI / 2;
  g.add(cooler);
  const fans = [];
  const fanRing = (x, y, z, rx, ry, off) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.052, 0.008, 8, 28), glow(off));
    ring.position.set(x, y, z);
    ring.rotation.set(rx, ry, 0);
    const blades = new THREE.Mesh(new THREE.CircleGeometry(0.045, 6), new THREE.MeshStandardMaterial({ color: 0x2a2d3a, transparent: true, opacity: 0.7 }));
    blades.position.copy(ring.position);
    blades.rotation.copy(ring.rotation);
    fans.push(blades);
    g.add(ring, blades);
  };
  // 3 ventoinhas embaixo e 3 na traseira, como num gabinete aquário
  for (let i = 0; i < 3; i++) fanRing(0.03, 0.035, -0.13 + i * 0.13, -Math.PI / 2, 0, i * 0.12);
  for (let i = 0; i < 3; i++) fanRing(0.03, 0.1 + i * 0.13, -D / 2 + 0.03, 0, 0, 0.4 + i * 0.12);
  const light = new THREE.PointLight(0xff00ff, 3, 2.2, 2);
  light.position.set(0.05, H * 0.5, 0.05);
  g.add(light);
  return { group: g, rgb, fans, light };
}

function television(tvW, tvH) {
  const g = new THREE.Group();
  g.add(box(tvW + 0.05, tvH + 0.05, 0.05, mat(0x0d0d12, { roughness: 0.3, metalness: 0.4 })));
  // "Buraco" no canvas: pixels transparentes deixam o vídeo (iframe atrás do canvas) aparecer.
  const hole = new THREE.Mesh(
    new THREE.PlaneGeometry(tvW, tvH),
    new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0, transparent: false, blending: THREE.NoBlending }),
  );
  hole.position.z = 0.0255;
  g.add(hole);
  g.add(box(0.3, 0.02, 0.18, mat(0x0d0d12), 0, -tvH / 2 - 0.065, 0));
  g.add(box(0.05, 0.06, 0.03, mat(0x0d0d12), 0, -tvH / 2 - 0.035, 0));
  return { group: g, hole };
}

function consoleBox() {
  const g = new THREE.Group();
  const white = mat(0xf2f2f5, { roughness: 0.35 });
  g.add(box(0.035, 0.39, 0.26, white, -0.04, 0.195, 0));
  g.add(box(0.035, 0.39, 0.26, white, 0.04, 0.195, 0));
  g.add(box(0.05, 0.37, 0.24, mat(0x111216), 0, 0.185, 0));
  g.add(box(0.052, 0.3, 0.004, new THREE.MeshBasicMaterial({ color: 0x4aa3ff, toneMapped: false }), 0, 0.2, 0.121));
  return g;
}

function gameCase(tex) {
  const g = new THREE.Group();
  g.add(box(0.24, 0.31, 0.025, mat(0x0e0e14)));
  const cover = new THREE.Mesh(new THREE.PlaneGeometry(0.235, 0.305), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.5, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.25 }));
  cover.position.z = 0.0126;
  g.add(cover);
  return g;
}

function controller() {
  const g = new THREE.Group();
  const black = mat(0x1a1b22);
  g.add(box(0.16, 0.035, 0.09, black, 0, 0.02, 0));
  for (const x of [-0.06, 0.06]) {
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.02, 0.08, 8), black);
    grip.rotation.x = Math.PI / 2.4;
    grip.position.set(x, 0.015, 0.04);
    g.add(grip);
  }
  g.add(box(0.06, 0.004, 0.02, new THREE.MeshBasicMaterial({ color: 0x4aa3ff, toneMapped: false }), 0, 0.04, -0.03));
  return g;
}

function marker(color) {
  const m = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.075, 0),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.4, flatShading: true, roughness: 0.3 }),
  );
  m.scale.y = 1.8;
  return m;
}

function framed(tex, w, h) {
  const g = new THREE.Group();
  g.add(box(w + 0.04, h + 0.04, 0.02, mat(0x101117)));
  const art = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7 }));
  art.position.z = 0.011;
  g.add(art);
  return g;
}

/* ---------- O quarto ---------- */

export async function createRoom({ stage, tip, labels, onAction }) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = matchMedia('(max-width: 767px)').matches;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.85;
  renderer.shadowMap.enabled = !small;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const css = new CSS3DRenderer();
  css.domElement.className = 'room-css';
  renderer.domElement.className = 'room-gl';
  stage.append(css.domElement, renderer.domElement);

  const scene = new THREE.Scene();
  const cssScene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 60);

  await document.fonts.load(`700 30px ${MONO}`).catch(() => {});

  const loader = new GLTFLoader();
  const models = new Map(
    await Promise.all(MODELS.map((n) => loader.loadAsync(`assets/kenney/${n}.glb`).then((g) => [n, g.scene]))),
  );

  // Coloca um modelo do Kenney com o ponto de apoio no centro da base.
  function kenney(name, { x = 0, y = 0, z = 0, rot = 0, scale = [K, K, K], parent = scene } = {}) {
    const src = models.get(name).clone(true);
    src.scale.set(...scale);
    const bb = new THREE.Box3().setFromObject(src);
    const c = bb.getCenter(new THREE.Vector3());
    src.position.set(-c.x, -bb.min.y, -c.z);
    const g = new THREE.Group();
    g.add(src);
    g.position.set(x, y, z);
    g.rotation.y = rot;
    g.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    parent.add(g);
    g.userData.size = bb.getSize(new THREE.Vector3());
    return g;
  }

  const add = (obj, x, y, z, rotY = 0) => {
    obj.position.set(x, y, z);
    obj.rotation.y = rotY;
    scene.add(obj);
    return obj;
  };

  // Chão e paredes (corte em L, estilo diorama)
  for (const [x, z] of [[1, 1], [3, 1], [1, 3], [3, 3]]) kenney('floorFull', { x, z, y: -0.1 });
  kenney('wall', { x: 1, z: -0.05 });
  kenney('wallWindow', { x: 3, z: -0.05 });
  kenney('wall', { x: -0.05, z: 1, rot: Math.PI / 2 });
  kenney('wall', { x: -0.05, z: 3, rot: Math.PI / 2 });
  add(box(0.1, 2.58, 0.1, mat(0x3a2f4a)), -0.05, 1.29, -0.05);

  const sky = canvasTexture(512, 440, drawSky);
  add(new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.8), new THREE.MeshBasicMaterial({ map: sky.tex, toneMapped: false })), 3, 1.35, -0.14);

  // Fita de LED no alto das paredes
  const ledBack = new THREE.MeshBasicMaterial({ color: 0xbd93f9, toneMapped: false });
  const ledLeft = new THREE.MeshBasicMaterial({ color: 0xff79c6, toneMapped: false });
  add(box(4, 0.025, 0.025, ledBack), 2, 2.45, 0.02);
  add(box(0.025, 0.025, 4, ledLeft), 0.02, 2.45, 2);

  // Escrivaninha com o setup
  const desk = kenney('desk', { x: 1.15, z: 0.4, scale: [2.5, K, K] });
  const deskTop = desk.userData.size.y;
  kenney('chairDesk', { x: 1.2, z: 1.2, rot: Math.PI });
  kenney('computerKeyboard', { x: 1.2, y: deskTop, z: 0.6, scale: [2.2, K, K] });
  kenney('computerMouse', { x: 1.55, y: deskTop, z: 0.62 });
  kenney('speakerSmall', { x: 0.38, y: deskTop, z: 0.22, scale: [1.3, 1.3, 1.3], rot: 0.3 });

  const editor = canvasTexture(1024, 576, drawEditor);
  const studio = canvasTexture(1024, 576, drawStudio);
  const term = canvasTexture(576, 1024, (c, w, h) => drawTerminal(c, w, h, 0));

  const bottom = monitor(editor.tex);
  const top = monitor(studio.tex);
  const side = monitor(term.tex, true);
  const pairX = 1.22;
  const bottomY = deskTop + 0.13 + bottom.h / 2;
  const topY = bottomY + bottom.h + 0.006;
  add(bottom.group, pairX, bottomY, 0.24);
  add(top.group, pairX, topY, 0.24);
  // O vertical fica colado à esquerda da dupla, um pouco virado pra cadeira.
  add(side.group, pairX - bottom.w / 2 - side.w / 2 + 0.012, (bottomY + topY) / 2, 0.255, 0.28);
  const metal = mat(0x2a2c36, { metalness: 0.7, roughness: 0.35 });
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, topY - deskTop + 0.1, 10), metal), pairX, (deskTop + topY + 0.1) / 2, 0.1);
  add(box(0.12, 0.02, 0.1, metal), pairX, deskTop + 0.01, 0.1);
  add(box(0.05, 0.04, 0.12, metal), pairX, bottomY, 0.17);
  add(box(0.05, 0.04, 0.12, metal), pairX, topY, 0.17);
  add(box(0.3, 0.035, 0.035, metal), pairX - 0.2, (bottomY + topY) / 2, 0.15);

  const pc = aquariumPc();
  add(pc.group, 1.83, deskTop, 0.3, -0.25);

  // Canto da TV
  const cab = kenney('cabinetTelevision', { x: 0.25, z: 2.75, rot: Math.PI / 2, scale: [2.6, K, K] });
  const cabTop = cab.userData.size.y;
  const TV = { w: 1.3, h: 0.731 };
  const tv = television(TV.w, TV.h);
  const tvY = cabTop + 0.1 + TV.h / 2;
  add(tv.group, 0.2, tvY, 2.95, Math.PI / 2);
  add(consoleBox(), 0.25, cabTop, 3.66, Math.PI / 2);
  const deployCase = add(gameCase(canvasTexture(270, 350, drawDeployCover).tex), 0.33, cabTop + 0.155, 1.86, Math.PI / 2);
  const marsCase = add(gameCase(canvasTexture(270, 350, drawMarsCover).tex), 0.33, cabTop + 0.155, 2.13, Math.PI / 2);
  deployCase.rotation.z = -0.05;
  marsCase.rotation.z = 0.04;

  kenney('rugRound', { x: 1.7, z: 2.85, scale: [2.4, K, 2.4] });
  // Puff de frente pra TV, com o controle do lado
  const beanbag = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 1), mat(0x6b4fa8, { flatShading: true, roughness: 0.9 }));
  beanbag.scale.set(1, 0.6, 1);
  beanbag.castShadow = true;
  beanbag.receiveShadow = true;
  add(beanbag, 1.85, 0.24, 3.05);
  add(controller(), 1.3, 0, 2.75, 1.2);

  // Decoração
  kenney('lampRoundFloor', { x: 3.65, z: 0.4 });
  kenney('pottedPlant', { x: 2.35, z: 0.3 });
  kenney('bookcaseOpenLow', { x: 3.0, z: 0.28 });
  kenney('books', { x: 2.9, y: 0.8, z: 0.28, rot: 0.2 });
  add(framed(canvasTexture(400, 560, drawPoster).tex, 0.6, 0.84), 0.015, 1.65, 1.3, Math.PI / 2);
  add(framed(canvasTexture(420, 260, drawWallPoster).tex, 0.5, 0.31), pairX, 2.02, 0.012);

  // Luzes: noite, com a lua entrando pela janela
  scene.add(new THREE.HemisphereLight(0x7a6cff, 0x140c22, 0.55));
  const moon = new THREE.DirectionalLight(0xa8bcff, 1.2);
  moon.position.set(4.5, 4.5, -3.5);
  moon.target.position.set(2.2, 0, 2);
  moon.castShadow = true;
  moon.shadow.mapSize.set(2048, 2048);
  Object.assign(moon.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 1, far: 14 });
  moon.shadow.bias = -0.0005;
  scene.add(moon, moon.target);
  const lamp = new THREE.PointLight(0xffb36b, 2.2, 4.5, 2);
  lamp.position.set(3.65, 1.6, 0.45);
  const deskLight = new THREE.PointLight(0x8be9fd, 1.4, 2.2, 2);
  deskLight.position.set(1.2, 1.2, 0.75);
  const tvLight = new THREE.PointLight(0x9db4ff, 1.8, 3, 2);
  tvLight.position.set(0.75, tvY, 2.95);
  const ledLight = new THREE.PointLight(0xbd93f9, 1.6, 4, 2);
  ledLight.position.set(0.4, 2.35, 0.4);
  scene.add(lamp, deskLight, tvLight, ledLight);

  /* ---------- TV com o canal tocando ---------- */

  const tvEl = document.createElement('div');
  tvEl.className = 'room-tv';
  tvEl.innerHTML = '<div class="room-tv-card"><span>▶</span>Debugando</div>';
  const tvObj = new CSS3DObject(tvEl);
  const PX = 1280;
  tvObj.position.set(0.2 + 0.0255, tvY, 2.95);
  tvObj.rotation.y = Math.PI / 2;
  tvObj.scale.setScalar(TV.w / PX);
  cssScene.add(tvObj);
  let iframe = null;
  function startVideo() {
    if (iframe) return;
    iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/videoseries?list=${UPLOADS}&autoplay=1&mute=1&controls=0&loop=1&playsinline=1&rel=0&enablejsapi=1`;
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
    iframe.title = 'Debugando';
    iframe.tabIndex = -1;
    tvEl.append(iframe);
  }
  const video = (func) => iframe?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args: '' }), '*');

  /* ---------- Coisas clicáveis ---------- */

  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const targets = [
    { id: 'pc', hit: add(box(1.75, 0.95, 0.7, hitMat), 1.3, deskTop + 0.42, 0.33), mark: marker(0x50fa7b), at: [1.3, topY + 0.38, 0.3] },
    { id: 'tv', hit: add(box(0.25, TV.h + 0.1, TV.w + 0.1, hitMat), 0.25, tvY, 2.95), mark: marker(0xff5555), at: [0.3, tvY + TV.h / 2 + 0.3, 2.95] },
    { id: 'deploy', hit: add(box(0.25, 0.4, 0.26, hitMat), 0.36, cabTop + 0.17, 1.86), mark: marker(0xf1fa8c), at: [0.36, cabTop + 0.55, 1.86] },
    { id: 'mars', hit: add(box(0.25, 0.4, 0.26, hitMat), 0.36, cabTop + 0.17, 2.13), mark: marker(0xffb86c), at: [0.36, cabTop + 0.55, 2.13] },
  ];
  for (const t of targets) {
    t.hit.castShadow = false;
    t.mark.position.set(...t.at);
    t.base = t.at[1];
    scene.add(t.mark);
  }

  /* ---------- Câmera ---------- */

  const look = new THREE.Vector3(1.75, 0.95, 1.85);
  const dir = new THREE.Vector3(1, 0.78, 1.05).normalize();
  function overview() {
    const aspect = camera.aspect;
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    const radius = aspect < 1 ? 3.3 : 2.75;
    const dist = radius / Math.sin(Math.min(vFov, hFov) / 2);
    // No celular (em pé) o quarto sobe um pouco pra deixar espaço pros botões embaixo.
    const target = look.clone().add(new THREE.Vector3(0, aspect < 1 ? -0.35 : 0, 0));
    return { pos: target.clone().addScaledVector(dir, dist), target };
  }
  const monitorFocus = () => {
    const target = new THREE.Vector3(pairX, bottomY, 0.24);
    return { pos: target.clone().add(new THREE.Vector3(0, 0.02, 0.62)), target };
  };

  const cam = { pos: new THREE.Vector3(), target: new THREE.Vector3() };
  let tween = null;
  let mode = 'overview';
  const parallax = new THREE.Vector2();
  const parallaxNow = new THREE.Vector2();
  const ZERO = new THREE.Vector2();

  function animateTo(to, duration) {
    return new Promise((resolve) => {
      if (reduced || duration === 0) {
        cam.pos.copy(to.pos);
        cam.target.copy(to.target);
        return resolve();
      }
      tween = { from: { pos: cam.pos.clone(), target: cam.target.clone() }, to, start: performance.now(), duration, resolve };
    });
  }

  function resize() {
    const { clientWidth: w, clientHeight: h } = stage;
    renderer.setSize(w, h);
    css.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (mode === 'overview' && !tween) {
      const o = overview();
      cam.pos.copy(o.pos);
      cam.target.copy(o.target);
    }
  }
  addEventListener('resize', resize);
  resize();

  // Entrada: a câmera chega de longe enquanto as coisas vão ligando.
  const start = overview();
  cam.pos.copy(start.target.clone().addScaledVector(dir, start.pos.distanceTo(start.target) * 1.7).add(new THREE.Vector3(0, 1.2, 0)));
  cam.target.copy(start.target);
  animateTo(overview(), 2600);
  const screens = [bottom.screen, top.screen, side.screen];
  screens.forEach((s, i) => setTimeout(() => s.material.color.set(0xffffff), reduced ? 0 : 700 + i * 260));
  setTimeout(startVideo, reduced ? 0 : 1200);

  /* ---------- Interação ---------- */

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let hovered = null;
  let highlighted = null;

  function pick(e) {
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects(targets.map((t) => t.hit))[0];
    return hit ? targets.find((t) => t.hit === hit.object) : null;
  }

  function showTip(t, e) {
    if (!t) {
      tip.hidden = true;
      return;
    }
    tip.textContent = labels()[t.id];
    tip.hidden = false;
    tip.style.transform = `translate(${e.clientX + 16}px, ${e.clientY + 14}px)`;
  }

  const canvas = renderer.domElement;
  canvas.addEventListener('pointermove', (e) => {
    parallax.set((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1);
    if (mode !== 'overview' || e.pointerType === 'touch') return;
    hovered = pick(e);
    canvas.style.cursor = hovered ? 'pointer' : '';
    showTip(hovered, e);
  });
  canvas.addEventListener('pointerleave', () => {
    hovered = null;
    tip.hidden = true;
  });
  let downAt = null;
  canvas.addEventListener('pointerdown', (e) => (downAt = [e.clientX, e.clientY]));
  canvas.addEventListener('pointerup', (e) => {
    if (!downAt || mode !== 'overview' || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 8) return;
    const t = pick(e);
    tip.hidden = true;
    if (t) onAction(t.id);
  });

  /* ---------- Loop ---------- */

  let running = true;
  let last = performance.now();
  let termOffset = 0;
  let termTimer = 0;
  const color = new THREE.Color();

  function frame(now) {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const t = now / 1000;

    if (tween) {
      const k = Math.min((now - tween.start) / tween.duration, 1);
      const e = ease(k);
      cam.pos.lerpVectors(tween.from.pos, tween.to.pos, e);
      cam.target.lerpVectors(tween.from.target, tween.to.target, e);
      if (k === 1) {
        const done = tween.resolve;
        tween = null;
        done();
      }
    }

    // Parallax suave seguindo o mouse (só na vista geral)
    parallaxNow.lerp(mode === 'overview' && !reduced ? parallax : ZERO, 0.05);
    const right = new THREE.Vector3().crossVectors(dir, camera.up).normalize();
    camera.position.copy(cam.pos).addScaledVector(right, -parallaxNow.x * 0.35).addScaledVector(camera.up, parallaxNow.y * 0.25);
    camera.lookAt(cam.target);

    // RGB do PC girando pelo arco-íris
    for (const { m, hueOffset } of pc.rgb) m.emissive.setHSL((t * 0.12 + hueOffset) % 1, 1, 0.5);
    pc.light.color.setHSL((t * 0.12) % 1, 1, 0.55);
    if (!reduced) for (const f of pc.fans) f.rotateZ(dt * 9);
    ledBack.color.copy(color.setHSL(0.74 + Math.sin(t * 0.6) * 0.04, 0.9, 0.7));
    tvLight.intensity = 1.6 + Math.sin(t * 7) * 0.2 + Math.sin(t * 2.3) * 0.3;

    // Terminal do monitor vertical rolando
    termTimer += dt;
    if (termTimer > 0.9) {
      termTimer = 0;
      drawTerminal(term.ctx, term.canvas.width, term.canvas.height, ++termOffset);
      term.tex.needsUpdate = true;
    }

    for (const tg of targets) {
      const active = tg === hovered || tg.id === highlighted;
      if (!reduced) {
        tg.mark.rotation.y += dt * 1.6;
        tg.mark.position.y = tg.base + Math.sin(t * 2.2 + tg.base * 3) * 0.04;
      }
      const s = THREE.MathUtils.lerp(tg.mark.scale.x, active ? 1.5 : 1, 0.15);
      tg.mark.scale.set(s, s * 1.8, s);
      tg.mark.visible = mode === 'overview';
    }

    renderer.render(scene, camera);
    css.render(cssScene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  return {
    async enter() {
      mode = 'focus';
      tip.hidden = true;
      await animateTo(monitorFocus(), 1100);
      running = false; // o quarto fica parado (e desfocado) atrás da janela
      video('pauseVideo');
    },
    exit() {
      mode = 'overview';
      if (!running) {
        running = true;
        last = performance.now();
        requestAnimationFrame(frame);
      }
      video('playVideo');
      return animateTo(overview(), 1100);
    },
    // Vai direto pra dentro do computador (link direto pra um arquivo, por exemplo).
    jumpIn() {
      mode = 'focus';
      const f = monitorFocus();
      tween = null;
      cam.pos.copy(f.pos);
      cam.target.copy(f.target);
      requestAnimationFrame(() => (running = false));
    },
    highlight(id) {
      highlighted = id;
    },
  };
}
