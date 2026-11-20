import { BADGES, FILES, FOLDERS, LANGUAGES, LINKS, ROOT, UI } from './content.js';
import { escapeHTML, highlight } from './highlight.js';
import { icon } from './icons.js';
import { createTerminal } from './terminal.js';
import { createBugs } from './bugs.js';
import { toast } from './toast.js';
import { createAchievements } from './achievements.js';
import { createNpc } from './npc.js';

const $ = (selector) => document.querySelector(selector);
const mobile = matchMedia('(max-width: 767px)');

const store = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* sem localStorage (aba anônima, etc.): só não lembra a escolha */
    }
  },
};

const isLang = (value) => value === 'pt' || value === 'en';

function detectLang() {
  const fromUrl = new URLSearchParams(location.search).get('lang');
  if (isLang(fromUrl)) return fromUrl;
  const saved = store.get('lang');
  if (isLang(saved)) return saved;
  return (navigator.language || 'pt').toLowerCase().startsWith('pt') ? 'pt' : 'en';
}

const state = {
  lang: detectLang(),
  tabs: [],
  active: null,
  sidebar: !mobile.matches,
  terminal: false,
  collapsed: new Set(),
};

const ui = () => UI[state.lang];
const fileById = (id) => FILES.find((f) => f.id === id);
const fileName = (f) => f.name[state.lang];
const folderName = (key) => FOLDERS[key][state.lang];
const filePath = (f) => (f.folder ? `${folderName(f.folder)}/${fileName(f)}` : fileName(f));
const byName = (a, b) => fileName(a).localeCompare(fileName(b));

function badge(file) {
  const { label, color } = BADGES[file.lang];
  return `<span class="badge${label.length > 2 ? ' badge-sm' : ''}" style="color:${color}" aria-hidden="true">${escapeHTML(label)}</span>`;
}

/* ---------- Explorador ---------- */

function fileItem(file, depth) {
  const active = file.id === state.active;
  return `<li><a class="tree-item${active ? ' is-active' : ''}" href="#/${file.id}" style="--depth:${depth}"${
    active ? ' aria-current="page"' : ''
  }>${badge(file)}<span class="tree-label">${escapeHTML(fileName(file))}</span></a></li>`;
}

function renderExplorer() {
  const folders = Object.keys(FOLDERS).sort((a, b) => folderName(a).localeCompare(folderName(b)));
  let html = '';
  for (const key of folders) {
    const open = !state.collapsed.has(key);
    html += `<li><button class="tree-item tree-folder" data-folder="${key}" aria-expanded="${open}" style="--depth:0">${icon(
      'chevron',
      'chevron'
    )}<span class="tree-label">${escapeHTML(folderName(key))}</span></button>`;
    if (open) {
      const children = FILES.filter((f) => f.folder === key).sort(byName);
      html += `<ul>${children.map((f) => fileItem(f, 1)).join('')}</ul>`;
    }
    html += '</li>';
  }
  html += FILES.filter((f) => !f.folder && !f.hidden)
    .sort(byName)
    .map((f) => fileItem(f, 0))
    .join('');
  $('#file-tree').innerHTML = html;

  $('#link-list').innerHTML = LINKS.map(
    (link) =>
      `<li><a class="tree-item" href="${link.url}" target="_blank" rel="noopener" style="--depth:0">${icon(
        link.icon,
        'brand'
      )}<span class="tree-label">${escapeHTML(link.label)}</span>${icon('external', 'external')}<span class="sr-only">(${
        ui().newTab
      })</span></a></li>`
  ).join('');
}

/* ---------- Abas e editor ---------- */

function renderTabs() {
  const tabs = $('#tabs');
  tabs.innerHTML = state.tabs
    .map((id) => {
      const file = fileById(id);
      const active = id === state.active;
      return `<div class="tab${active ? ' is-active' : ''}" data-id="${id}">
        <a class="tab-link" id="tab-${id}" href="#/${id}" role="tab" aria-selected="${active}" aria-controls="editor">${badge(
          file
        )}<span>${escapeHTML(fileName(file))}</span></a>
        <button class="tab-close" data-close="${id}" aria-label="${escapeHTML(ui().closeTab(fileName(file)))}">${icon(
          'close'
        )}</button>
      </div>`;
    })
    .join('');

  // Mantém a aba ativa visível sem rolar a página inteira.
  const activeTab = tabs.querySelector('.is-active');
  if (activeTab) {
    const left = activeTab.offsetLeft;
    const right = left + activeTab.offsetWidth;
    if (left < tabs.scrollLeft) tabs.scrollLeft = left;
    else if (right > tabs.scrollLeft + tabs.clientWidth) tabs.scrollLeft = right - tabs.clientWidth;
  }

  const file = fileById(state.active);
  $('#editor-actions').innerHTML = file?.runnable
    ? `<button class="icon-btn run-btn" id="run-btn" title="${ui().run}" aria-label="${ui().run} ${escapeHTML(
        fileName(file)
      )}">${icon('play')}</button>`
    : '';
}

function renderBreadcrumbs() {
  const file = fileById(state.active);
  const crumbs = $('#breadcrumbs');
  crumbs.hidden = !file;
  if (!file) return;
  const parts = [ROOT, ...(file.folder ? [folderName(file.folder)] : [])].map((p) => `<span>${escapeHTML(p)}</span>`);
  parts.push(`<span class="crumb-file">${badge(file)}${escapeHTML(fileName(file))}</span>`);
  crumbs.innerHTML = parts.join(icon('chevron', 'crumb-sep'));
}

function welcomeHTML() {
  const about = fileById('about');
  return `<div class="welcome">
    <svg class="welcome-mark" viewBox="0 0 32 32" aria-hidden="true"><use href="#logo"/></svg>
    <p class="welcome-name">Filipe Campos</p>
    <p class="welcome-sub">${escapeHTML(ui().welcomeSub)}</p>
    <p class="welcome-heading">${escapeHTML(ui().welcomeStart)}</p>
    <ul class="welcome-list">
      <li><a href="#/about">${badge(about)}${escapeHTML(ui().welcomeOpen(fileName(about)))}</a></li>
      <li><button type="button" data-action="terminal">${icon('terminal')}${escapeHTML(ui().welcomeTerminal)}</button><kbd>Ctrl + \`</kbd></li>
      <li><button type="button" data-action="explorer">${icon('files')}${escapeHTML(ui().welcomeExplorer)}</button><kbd>Ctrl + B</kbd></li>
    </ul>
  </div>`;
}

function renderEditor({ resetScroll = true } = {}) {
  const editor = $('#editor');
  const file = fileById(state.active);
  if (!file) {
    editor.classList.add('is-welcome');
    editor.removeAttribute('aria-labelledby');
    editor.innerHTML = welcomeHTML();
    return;
  }
  editor.classList.remove('is-welcome');
  editor.setAttribute('aria-labelledby', `tab-${file.id}`);
  if (file.view) {
    editor.innerHTML = trophies.render();
    if (resetScroll) editor.scrollTop = 0;
    return;
  }
  const lines = file.body[state.lang].split('\n');
  editor.innerHTML = `<div class="code" data-lang="${file.lang}">${lines
    .map((line, i) => {
      const caret = i === lines.length - 1 ? '<span class="caret" aria-hidden="true"></span>' : '';
      return `<div class="line"><span class="ln" aria-hidden="true">${i + 1}</span><span class="lc">${
        highlight(line, file.lang) || ' '
      }${caret}</span></div>`;
    })
    .join('')}</div>`;
  if (resetScroll) editor.scrollTop = 0;
}

function renderChrome() {
  const file = fileById(state.active);
  const title = file ? `${fileName(file)} — ${ROOT}` : ROOT;
  $('#window-title').textContent = title;
  document.title = file ? `${fileName(file)} · Filipe Campos` : 'Filipe Campos | Dev';
  $('#status-lang').textContent = file ? (file.view ? ui().achievements : LANGUAGES[file.lang]) : '';
  $('#status-lang').hidden = !file;
}

function render(opts) {
  renderExplorer();
  renderTabs();
  renderBreadcrumbs();
  renderEditor(opts);
  renderChrome();
}

/* ---------- Navegação ---------- */

const urlFor = (id) => `${location.pathname}${location.search}${id ? `#/${id}` : ''}`;

function openFile(id) {
  if (!visited.has(id)) {
    visited.add(id);
    if (bugsStarted) setTimeout(() => spawnBugs(1), 700);
    if (FILES.every((f) => f.hidden || visited.has(f.id))) trophies.unlock('reader');
    npc.react(id);
  }
  if (!state.tabs.includes(id)) {
    const at = state.tabs.indexOf(state.active);
    state.tabs.splice(at + 1, 0, id);
  }
  const changed = state.active !== id;
  state.active = id;
  render({ resetScroll: changed });
}

function closeTab(id) {
  const index = state.tabs.indexOf(id);
  if (index === -1) return;
  state.tabs.splice(index, 1);
  if (state.active === id) {
    state.active = state.tabs[index] ?? state.tabs[index - 1] ?? null;
    history.replaceState(null, '', urlFor(state.active));
  }
  render({ resetScroll: true });
}

function route() {
  const id = location.hash.replace(/^#\/?/, '');
  if (fileById(id)) {
    openFile(id);
    if (win.classList.contains('is-hidden') && inRoomMode()) enterPortfolio();
  }
  if (mobile.matches) setSidebar(false);
}

/* ---------- Idioma ---------- */

function setLang(lang) {
  if (!isLang(lang) || lang === state.lang) return;
  state.lang = lang;
  store.set('lang', lang);
  const params = new URLSearchParams(location.search);
  params.set('lang', lang);
  history.replaceState(null, '', `${location.pathname}?${params}${location.hash}`);
  applyStaticText();
  render({ resetScroll: false });
  trophies.unlock('bilingual');
  npc.react('lang', { force: true });
}

function applyStaticText() {
  const t = ui();
  document.documentElement.lang = t.htmlLang;
  for (const el of document.querySelectorAll('[data-i18n]')) el.textContent = t[el.dataset.i18n];
  for (const el of document.querySelectorAll('[data-i18n-label]')) {
    el.setAttribute('aria-label', t[el.dataset.i18nLabel]);
    el.title = t[el.dataset.i18nLabel];
  }
  for (const btn of document.querySelectorAll('.lang-switch button')) {
    btn.setAttribute('aria-pressed', String(btn.dataset.lang === state.lang));
  }
  updateMaxLabel();
  updateBugStatus();
  npc.setLabel(t.npcLabel);
  if (inRoomMode()) {
    for (const dot of document.querySelectorAll('.dot-min, .dot-close')) {
      dot.setAttribute('aria-label', t.backToRoom);
      dot.title = t.backToRoom;
    }
  }
}

/* ---------- Painéis e janela ---------- */

function setSidebar(open) {
  state.sidebar = open;
  document.body.classList.toggle('sidebar-open', open);
  $('#act-explorer').setAttribute('aria-pressed', String(open));
  $('#menu-btn').setAttribute('aria-expanded', String(open));
}

function setTerminal(open, { focus = true } = {}) {
  state.terminal = open;
  $('#panel').hidden = !open;
  $('#act-terminal').setAttribute('aria-pressed', String(open));
  $('#status-terminal').setAttribute('aria-pressed', String(open));
  if (open) {
    terminal.show({ focus });
    if (!terminalSeen) npc.react('terminal');
    terminalSeen = true;
  }
}

const win = $('#window');
let terminalSeen = false;

function updateMaxLabel() {
  const btn = $('[data-action="maximize"]');
  const label = win.classList.contains('is-max') ? ui().restore : ui().maximize;
  btn.setAttribute('aria-label', label);
  btn.title = label;
}

function windowAction(action) {
  if (action === 'maximize') {
    win.classList.add('is-animating');
    win.classList.toggle('is-max');
    setTimeout(() => win.classList.remove('is-animating'), 300);
    updateMaxLabel();
  } else if (action === 'minimize' || action === 'close') {
    if (action === 'close') closeAllTabs();
    if (inRoomMode()) return leavePortfolio();
    win.classList.add('is-hidden');
    $('#desktop-icon').hidden = false;
    $('#desktop-icon').focus();
  }
}

function closeAllTabs() {
  state.tabs = ['about'];
  state.active = 'about';
  history.replaceState(null, '', urlFor(null));
  setTerminal(false);
  render();
}

function reopenWindow() {
  win.classList.remove('is-hidden');
  $('#desktop-icon').hidden = true;
}

/* ---------- Bugs ---------- */

// Uma "fase": 7 bugs no total. 3 aparecem logo; cada arquivo novo aberto traz mais um.
const TOTAL_BUGS = 7;
const visited = new Set();
let bugsStarted = false;
let spawned = 0;
let squashed = 0;

const notify = (opts) => toast({ closeLabel: ui().close, ...opts });

function updateBugStatus() {
  const alive = bugs.alive();
  const item = $('#status-bugs');
  $('#bug-count').textContent = alive;
  item.classList.toggle('has-bugs', alive > 0);
  item.title = ui().bugs(alive);
}

function spawnBugs(count) {
  for (let i = 0; i < count && spawned < TOTAL_BUGS; i++, spawned++) bugs.spawn();
  updateBugStatus();
}

const bugs = createBugs({
  layer: $('#bugs'),
  onSquash: () => {
    squashed++;
    updateBugStatus();
    trophies.unlock('first-bug');
    if (squashed === TOTAL_BUGS) {
      trophies.unlock('all-bugs');
      npc.react('allBugs', { force: true });
    } else if (squashed === 1 || squashed % 3 === 0) npc.react('bug');
  },
});

/* ---------- Conquistas ---------- */

function updateTrophyStatus() {
  const { done, total } = trophies.progress();
  $('#trophy-count').textContent = `${done}/${total}`;
  if (state.active === 'achievements') renderEditor({ resetScroll: false });
}

const trophies = createAchievements({
  popup: $('#trophy-pop'),
  ui,
  lang: () => state.lang,
  onChange: () => updateTrophyStatus(),
});

// Qualquer link pro YouTube (no código ou no explorador) conta.
document.addEventListener('click', (e) => {
  if (e.target.closest('a[href*="youtu"]')) trophies.unlock('video');
});

function onCommand(name) {
  trophies.unlock('terminal');
  if (['sudo', 'deploy', 'contact'].includes(name)) trophies.unlock(name);
  if (name === 'youtube') trophies.unlock('video');
  if (name === 'deploy' && new Date().getDay() === 5) trophies.unlock('friday');
  if (name === 'npc') npc.summon();
}

/* ---------- NPC ---------- */

const npc = createNpc({
  host: $('#window'),
  lines: () => ui().npc,
  onClicks: (n) => n >= 10 && trophies.unlock('npc'),
});

/* ---------- Quarto 3D ---------- */

const GAMES = {
  deploy: 'https://lip-ee.github.io/deploy-de-sexta/',
  mars: 'https://out-of-space-exception.github.io/mike-on-mars/',
};
let room = null;
let extrasStarted = false;
const inRoomMode = () => document.body.classList.contains('has-room');

// Bugs e NPC só começam quando a pessoa entra no portfolio.
function startExtras() {
  if (extrasStarted) return;
  extrasStarted = true;
  setTimeout(startBugs, 2500);
  setTimeout(() => npc.react('greet', { force: true }), 5000);
}

function showWindow() {
  win.classList.remove('is-hidden');
  document.body.classList.add('in-portfolio');
  $('#desktop-icon').hidden = true;
  startExtras();
}

async function enterPortfolio() {
  if (room && !document.body.classList.contains('in-portfolio')) await room.enter();
  showWindow();
}

function leavePortfolio() {
  win.classList.add('is-hidden');
  document.body.classList.remove('in-portfolio');
  room?.exit();
}

function roomAction(id) {
  if (id === 'pc') return enterPortfolio();
  if (id === 'tv') {
    window.open(LINKS.find((l) => l.id === 'youtube').url, '_blank', 'noopener');
    trophies.unlock('video');
  } else {
    window.open(GAMES[id], '_blank', 'noopener');
    trophies.unlock('gamer');
  }
}

for (const act of document.querySelectorAll('.room-act')) {
  const id = act.dataset.target;
  act.addEventListener('pointerenter', () => room?.highlight(id));
  act.addEventListener('pointerleave', () => room?.highlight(null));
  act.addEventListener('focus', () => room?.highlight(id));
  act.addEventListener('blur', () => room?.highlight(null));
}
$('.room-act-main').addEventListener('click', enterPortfolio);
$('#home-btn').addEventListener('click', leavePortfolio);

function bootRoom(deepLink) {
  let webgl = false;
  try {
    webgl = !!document.createElement('canvas').getContext('webgl2');
  } catch {
    /* sem WebGL: fica só o portfolio */
  }
  if (!webgl) return showWindow();

  document.body.classList.add('has-room');
  $('#room').hidden = false;
  if (deepLink) showWindow();
  else win.classList.add('is-hidden');

  const fallback = () => {
    document.body.classList.remove('has-room');
    $('#room').hidden = true;
    showWindow();
    applyStaticText();
  };
  // Se o 3D demorar demais (internet lenta), abre o portfolio e o quarto termina de carregar atrás.
  const slow = setTimeout(showWindow, 12000);

  import('./room.js')
    .then(({ createRoom }) =>
      createRoom({ stage: $('#room-stage'), tip: $('#room-tip'), labels: () => ui().room, onAction: roomAction }),
    )
    .then((r) => {
      clearTimeout(slow);
      room = r;
      $('#room-loading').hidden = true;
      if (document.body.classList.contains('in-portfolio')) r.jumpIn();
    })
    .catch((err) => {
      clearTimeout(slow);
      console.warn('Quarto 3D indisponível:', err);
      fallback();
    });
}

if (new Date().getHours() < 5) setTimeout(() => trophies.unlock('night'), 3500);

document.addEventListener('click', (e) => {
  if (e.target.closest('[data-game]')) trophies.unlock('gamer');
});

function startBugs() {
  bugsStarted = true;
  spawnBugs(3);
  notify({ icon: '🐛', title: ui().bugsArrived, text: ui().bugsArrivedText });
}

/* ---------- Eventos ---------- */

const terminal = createTerminal({
  root: ROOT,
  files: FILES,
  folders: FOLDERS,
  links: LINKS,
  ui,
  lang: () => state.lang,
  filePath,
  setLang,
  open: (id) => (location.hash = `#/${id}`),
  close: () => setTerminal(false),
  onCommand,
});

window.addEventListener('hashchange', route);

$('#file-tree').addEventListener('click', (e) => {
  const folder = e.target.closest('[data-folder]');
  if (!folder) return;
  const key = folder.dataset.folder;
  if (state.collapsed.has(key)) state.collapsed.delete(key);
  else state.collapsed.add(key);
  renderExplorer();
  $(`[data-folder="${key}"]`).focus();
});

$('#tabs').addEventListener('click', (e) => {
  const close = e.target.closest('[data-close]');
  if (close) closeTab(close.dataset.close);
});

// Botão do meio do mouse fecha a aba, igual no VS Code.
$('#tabs').addEventListener('auxclick', (e) => {
  const tab = e.target.closest('.tab');
  if (tab && e.button === 1) {
    e.preventDefault();
    closeTab(tab.dataset.id);
  }
});

$('#editor-actions').addEventListener('click', (e) => {
  if (!e.target.closest('#run-btn')) return;
  setTerminal(true);
  terminal.run(`./${fileName(fileById('contact'))}`);
});

$('#editor').addEventListener('click', (e) => {
  const action = e.target.closest('[data-action]')?.dataset.action;
  if (action === 'terminal') setTerminal(true);
  if (action === 'explorer') setSidebar(true);
});

for (const btn of document.querySelectorAll('.lang-switch button')) {
  btn.addEventListener('click', () => setLang(btn.dataset.lang));
}

$('#act-explorer').addEventListener('click', () => setSidebar(!state.sidebar));
$('#menu-btn').addEventListener('click', () => setSidebar(!state.sidebar));
$('#sidebar-close').addEventListener('click', () => setSidebar(false));
$('#backdrop').addEventListener('click', () => setSidebar(false));
$('#act-terminal').addEventListener('click', () => setTerminal(!state.terminal));
$('#status-terminal').addEventListener('click', () => setTerminal(!state.terminal));
$('#panel-close').addEventListener('click', () => setTerminal(false));
$('#desktop-icon').addEventListener('click', reopenWindow);
$('#status-trophies').addEventListener('click', () => (location.hash = '#/achievements'));

for (const dot of document.querySelectorAll('.win-dots [data-action]')) {
  dot.addEventListener('click', () => windowAction(dot.dataset.action));
}

document.addEventListener('keydown', (e) => {
  const mod = e.ctrlKey || e.metaKey;
  if (mod && (e.code === 'Backquote' || e.key === '`')) {
    e.preventDefault();
    setTerminal(!state.terminal);
  } else if (mod && !e.shiftKey && e.key.toLowerCase() === 'b') {
    e.preventDefault();
    setSidebar(!state.sidebar);
  } else if (e.key === 'Escape' && mobile.matches && state.sidebar) {
    setSidebar(false);
  }
});

mobile.addEventListener('change', (e) => setSidebar(!e.matches));

/* ---------- Início ---------- */

const initial = location.hash.replace(/^#\/?/, '');
state.tabs = ['about'];
state.active = 'about';
if (fileById(initial) && initial !== 'about') {
  state.tabs.push(initial);
  state.active = initial;
}

state.tabs.forEach((id) => visited.add(id));
bootRoom(Boolean(fileById(initial)));
applyStaticText();
updateTrophyStatus();
setSidebar(state.sidebar);
render();
