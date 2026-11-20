// Todo o conteúdo do portfolio fica aqui, em português e em inglês.
// Pra mudar um texto, edite o `body` do arquivo correspondente.

export const ROOT = 'filipe-campos';

export const LINKS = [
  { id: 'github', label: 'github.git', url: 'https://github.com/Lip-ee', icon: 'github' },
  { id: 'linkedin', label: 'linked.in', url: 'https://www.linkedin.com/in/devlipe/', icon: 'linkedin' },
  { id: 'youtube', label: 'youtube.tv', url: 'https://youtube.com/@debugandotv', icon: 'youtube' },
];

export const FOLDERS = {
  experience: { pt: 'experiencia', en: 'experience' },
  projects: { pt: 'projetos', en: 'projects' },
};

export const LANGUAGES = {
  md: 'Markdown',
  ts: 'TypeScript',
  gd: 'GDScript',
  yml: 'YAML',
  sh: 'Shell Script',
};

export const BADGES = {
  md: { label: 'M↓', color: '#8be9fd' },
  ts: { label: 'TS', color: '#6fa8ff' },
  gd: { label: 'GD', color: '#50fa7b' },
  yml: { label: 'YML', color: '#ff79c6' },
  sh: { label: '>_', color: '#f1fa8c' },
  trophy: { label: '🏆', color: '#f1fa8c' },
};

// Secretas aparecem como "???" até serem desbloqueadas. A platina exige todas as não secretas.
export const ACHIEVEMENTS = [
  { id: 'first-bug', icon: '🐛', pt: ['Primeiro sangue', 'Esmagou seu primeiro bug.'], en: ['First blood', 'Squashed your first bug.'] },
  { id: 'all-bugs', icon: '✅', pt: ['Deploy de sexta aprovado', 'Esmagou os 7 bugs de uma visita.'], en: ['Friday deploy approved', 'Squashed all 7 bugs in one visit.'] },
  { id: 'reader', icon: '📖', pt: ['Leu o código-fonte', 'Abriu todos os arquivos do portfolio.'], en: ['Read the source', 'Opened every file in the portfolio.'] },
  { id: 'terminal', icon: '💻', pt: ['Hacker de filme', 'Rodou um comando no terminal.'], en: ['Movie hacker', 'Ran a command in the terminal.'] },
  { id: 'deploy', icon: '🚀', pt: ['Funciona na minha máquina', 'Rodou deploy no terminal.'], en: ['Works on my machine', 'Ran deploy in the terminal.'] },
  { id: 'bilingual', icon: '🌎', pt: ['Bilíngue', 'Trocou o idioma do portfolio.'], en: ['Bilingual', 'Switched the portfolio language.'] },
  { id: 'contact', icon: '🤝', pt: ['Networking', 'Executou o contato.sh.'], en: ['Networking', 'Ran contact.sh.'] },
  { id: 'video', icon: '📺', pt: ['Bora pro canal', 'Abriu o Debugando ou um dos vídeos.'], en: ['Off to the channel', 'Opened Debugando or one of its videos.'] },
  { id: 'gamer', icon: '🎮', pt: ['Player 1', 'Abriu um dos jogos no quarto.'], en: ['Player 1', 'Opened one of the games in the room.'] },
  { id: 'sudo', icon: '🚫', secret: true, pt: ['Boa tentativa', 'Tentou usar sudo.'], en: ['Nice try', 'Tried to use sudo.'] },
  { id: 'friday', icon: '🔥', secret: true, pt: ['Vive perigosamente', 'Rodou deploy numa sexta-feira.'], en: ['Living dangerously', 'Ran deploy on a Friday.'] },
  { id: 'npc', icon: '🧍', secret: true, pt: ['Deixa o NPC em paz', 'Clicou no NPC 10 vezes.'], en: ['Leave the NPC alone', 'Clicked the NPC 10 times.'] },
  { id: 'night', icon: '🦉', secret: true, pt: ['Coruja', 'Visitou o portfolio de madrugada.'], en: ['Night owl', 'Visited the portfolio after midnight.'] },
  { id: 'platinum', icon: '🏆', platinum: true, pt: ['Platina', 'Desbloqueou todas as conquistas. As secretas são bônus.'], en: ['Platinum', 'Unlocked every achievement. Secret ones are a bonus.'] },
];

// Itens da tela inicial do videogame (estilo PlayStation).
export const CONSOLE_ITEMS = [
  {
    id: 'deploy',
    game: true,
    art: 'deploy',
    url: 'https://lip-ee.github.io/deploy-de-sexta/',
    pt: { title: 'Deploy de Sexta', meta: 'Godot · roda no navegador', desc: 'Sexta-feira, 17:58. Alguém publicou uma atualização "pequena". Monte o time da LíderHub e segure os bugs até a meia-noite.' },
    en: { title: 'Deploy de Sexta', meta: 'Godot · plays in the browser', desc: 'Friday, 5:58 PM. Someone shipped a "small" update. Assemble the LíderHub team and hold off the bugs until midnight.' },
  },
  {
    id: 'mars',
    game: true,
    art: 'mars',
    url: 'https://out-of-space-exception.github.io/mike-on-mars/',
    pt: { title: 'Mike on Mars', meta: 'NASA Space Apps Challenge 2026 · roda no navegador', desc: 'Jogo de ciência pra crianças de 7 a 12 anos: construa a base do Mike na Cratera Gale, cultive plantas e enfrente tempestades solares com dados reais da NASA.' },
    en: { title: 'Mike on Mars', meta: 'NASA Space Apps Challenge 2026 · plays in the browser', desc: "A science game for kids aged 7 to 12: build Mike's base in Gale Crater, grow plants and face solar storms from real NASA data." },
  },
  {
    id: 'debugando',
    art: 'debugando',
    url: 'https://youtube.com/@debugandotv',
    pt: { title: 'Debugando', meta: 'YouTube · canal', desc: 'Games, filmes e séries explicados por dentro, com código de verdade.' },
    en: { title: 'Debugando', meta: 'YouTube · channel (in Portuguese)', desc: 'Games, movies and TV shows explained from the inside, with real code.' },
  },
];

export const FILES = [
  { id: 'achievements', hidden: true, view: 'achievements', lang: 'trophy', name: { pt: 'conquistas', en: 'achievements' } },
  {
    id: 'about',
    lang: 'md',
    name: { pt: 'sobre.md', en: 'about.md' },
    body: {
      pt: `# Filipe Campos

> Dev na LíderHub e criador do Debugando.

Sou dev na **LíderHub**: desenvolvo features da plataforma e investigo bug em produção, acompanhando o fluxo desde a causa até a correção.

Fora do trabalho, tenho o **Debugando**, um canal no YouTube que explica games, filmes e séries por dentro, com código de verdade. Eu testo as coisas no meu PC:

- medi quanto um shader trava o jogo
- escrevi uma Flórida inteira por sorteio
- coloquei o Doom pra rodar no navegador

O canal entrou no Programa de Parcerias do YouTube 15 dias depois do primeiro vídeo.

Gosto de entender como as coisas funcionam e de explicar isso de um jeito que qualquer um entenda.

## O que tem aqui

- [experiencia/liderhub.ts](#/liderhub): meu trabalho como dev
- [projetos/debugando.yml](#/debugando): o canal, meu projeto atual
- [projetos/deploy-de-sexta.gd](#/deploy-de-sexta): jogo de navegador sobre deploy na sexta
- [projetos/mike-on-mars.gd](#/mike-on-mars): jogo do NASA Space Apps Challenge 2026
- [contato.sh](#/contact): como falar comigo

<!-- dica: abra o terminal (Ctrl + \` ou o botão lá embaixo) e digite help -->`,
      en: `# Filipe Campos

> Developer at LíderHub and creator of Debugando.

I'm a developer at **LíderHub**: I build features for the platform and investigate production bugs, following the flow from root cause to fix.

Outside work, I run **Debugando**, a YouTube channel (in Portuguese) that explains games, movies and TV shows from the inside, with real code. I test things on my own PC:

- measured how much a shader makes a game stutter
- generated an entire Florida from random rolls
- got Doom running in the browser

The channel joined the YouTube Partner Program 15 days after the first video.

I like understanding how things work and explaining them in a way anyone can follow.

## What's in here

- [experience/liderhub.ts](#/liderhub): my work as a developer
- [projects/debugando.yml](#/debugando): the channel, my current project
- [projects/deploy-de-sexta.gd](#/deploy-de-sexta): a browser game about deploying on a Friday
- [projects/mike-on-mars.gd](#/mike-on-mars): our game for the NASA Space Apps Challenge 2026
- [contact.sh](#/contact): how to reach me

<!-- tip: open the terminal (Ctrl + \` or the button below) and type help -->`,
    },
  },
  {
    id: 'liderhub',
    folder: 'experience',
    lang: 'ts',
    name: { pt: 'liderhub.ts', en: 'liderhub.ts' },
    body: {
      pt: `// LíderHub: automação de WhatsApp com IA
// O código é privado, mas a plataforma está no ar.

export const liderhub = {
  site: "https://liderhub.ai",
  produto: "automação de WhatsApp com IA",
  cargo: "dev",
  status: "trabalho aqui atualmente",

  oQueEuFaco: [
    "ajudei a construir a plataforma",
    "dou manutenção no que está no ar",
    "investigo bug em produção, da causa até a correção",
    "desenvolvo e subo features novas",
  ],
} as const;`,
      en: `// LíderHub: AI-powered WhatsApp automation
// The code is private, but the platform is live.

export const liderhub = {
  site: "https://liderhub.ai",
  product: "AI-powered WhatsApp automation",
  role: "developer",
  status: "currently working here",

  whatIDo: [
    "helped build the platform",
    "maintain what's running in production",
    "investigate production bugs, from root cause to fix",
    "build and ship new features",
  ],
} as const;`,
    },
  },
  {
    id: 'debugando',
    folder: 'projects',
    lang: 'yml',
    name: { pt: 'debugando.yml', en: 'debugando.yml' },
    body: {
      pt: `# Debugando: meu projeto atual
# Games, filmes e séries explicados por dentro, com código de verdade.

canal: "@debugandotv"
link: https://youtube.com/@debugandotv
idioma: português

experimentos:
  - medi quanto um shader trava o jogo
  - escrevi uma Flórida inteira por sorteio
  - coloquei o Doom pra rodar no navegador

marcos:
  monetizavel_em: 9 dias
  programa_de_parcerias: 15 dias depois do primeiro vídeo

destaques:
  - titulo: "OS NPCs DO GTA 6 NÃO PENSAM"
    link: https://youtu.be/8JhuNVYdcSQ
  - titulo: "PEDI PRO CLAUDE FAZER O GTA | FABLE 5.2"
    link: https://youtu.be/rAalgQVhcyk
  - titulo: "DÁ PRA COPIAR SUA MENTE PRA UM CHIP?"
    link: https://youtu.be/ouv3ysGft_8`,
      en: `# Debugando: my current project
# Games, movies and TV shows explained from the inside, with real code.

channel: "@debugandotv"
link: https://youtube.com/@debugandotv
language: Portuguese

experiments:
  - measured how much a shader makes a game stutter
  - generated an entire Florida from random rolls
  - got Doom running in the browser

milestones:
  monetizable_in: 9 days
  partner_program: 15 days after the first video

featured:
  - title: "OS NPCs DO GTA 6 NÃO PENSAM"
    link: https://youtu.be/8JhuNVYdcSQ
  - title: "PEDI PRO CLAUDE FAZER O GTA | FABLE 5.2"
    link: https://youtu.be/rAalgQVhcyk
  - title: "DÁ PRA COPIAR SUA MENTE PRA UM CHIP?"
    link: https://youtu.be/ouv3ysGft_8`,
    },
  },
  {
    id: 'deploy-de-sexta',
    folder: 'projects',
    lang: 'gd',
    name: { pt: 'deploy-de-sexta.gd', en: 'deploy-de-sexta.gd' },
    body: {
      pt: `# Deploy de Sexta
# Sexta-feira, 17:58. Alguém publicou uma atualização "pequena".
# Monte o time da LíderHub e segure os bugs até a meia-noite.

extends Node

const JOGAR = "https://lip-ee.github.io/deploy-de-sexta/"
const REPOSITORIO = "https://github.com/Lip-ee/deploy-de-sexta"

var engine = "Godot, exportado pro navegador"
var arte = "pack Sunnyside World (itch.io)"
var fonte = "Pixelify Sans"

func _ready():
	montar_o_time()
	while not deu_meia_noite():
		segurar_os_bugs()`,
      en: `# Deploy de Sexta ("Friday Deploy")
# Friday, 5:58 PM. Someone shipped a "small" update.
# Assemble the LíderHub team and hold off the bugs until midnight.

extends Node

const PLAY = "https://lip-ee.github.io/deploy-de-sexta/"
const REPO = "https://github.com/Lip-ee/deploy-de-sexta"

var engine = "Godot, exported to the browser"
var art = "Sunnyside World pack (itch.io)"
var font = "Pixelify Sans"

func _ready():
	assemble_the_team()
	while not is_midnight():
		hold_off_the_bugs()`,
    },
  },
  {
    id: 'mike-on-mars',
    folder: 'projects',
    lang: 'gd',
    name: { pt: 'mike-on-mars.gd', en: 'mike-on-mars.gd' },
    body: {
      pt: `# Mike on Mars
# Jogo de ciência gratuito pra crianças de 7 a 12 anos.
# Feito pelo time Out of Space Exception, do qual faço parte, no
# NASA Space Apps Challenge 2026 (desafio Junior Astronaut Mission Trainer).

extends Node

const JOGAR = "https://out-of-space-exception.github.io/mike-on-mars/"
const PITCH = "https://youtu.be/a0S8g7tr5jQ"
const REPOSITORIO = "https://github.com/Out-Of-Space-Exception/mike-on-mars"

var idiomas = ["português", "english", "español", "français"]
var roda_em = ["navegador", "celular", "computador"]

func _ready():
	construir_a_base("Cratera Gale")
	# plantas como as que astronautas cultivaram no espaço
	cultivar_plantas()
	# tempestades solares com dados reais do DONKI, da NASA
	enfrentar_tempestades_solares()
	# cada carta traz a fonte da NASA
	colecionar_cartas_de_ciencia()`,
      en: `# Mike on Mars
# A free science game for kids aged 7 to 12.
# Made by team Out of Space Exception, which I'm part of, for the
# NASA Space Apps Challenge 2026 (Junior Astronaut Mission Trainer challenge).

extends Node

const PLAY = "https://out-of-space-exception.github.io/mike-on-mars/"
const PITCH = "https://youtu.be/a0S8g7tr5jQ"
const REPO = "https://github.com/Out-Of-Space-Exception/mike-on-mars"

var languages = ["english", "português", "español", "français"]
var runs_on = ["browser", "phone", "computer"]

func _ready():
	build_the_base("Gale Crater")
	# plants like the ones astronauts grew in space
	grow_plants()
	# solar storms using real data from NASA's DONKI
	face_solar_storms()
	# every card cites its NASA source
	collect_science_cards()`,
    },
  },
  {
    id: 'contact',
    lang: 'sh',
    runnable: true,
    name: { pt: 'contato.sh', en: 'contact.sh' },
    body: {
      pt: `#!/usr/bin/env bash
# Quer conversar sobre trabalho, um projeto ou um vídeo?
# O melhor caminho é o LinkedIn.

LINKEDIN="https://www.linkedin.com/in/devlipe/"

echo "Abrindo o LinkedIn do Filipe..."
xdg-open "$LINKEDIN"

# Aperte o ▶ ali em cima ou rode ./contato.sh no terminal.`,
      en: `#!/usr/bin/env bash
# Want to talk about work, a project or a video?
# LinkedIn is the best way to reach me.

LINKEDIN="https://www.linkedin.com/in/devlipe/"

echo "Opening Filipe's LinkedIn..."
xdg-open "$LINKEDIN"

# Hit the ▶ button above or run ./contact.sh in the terminal.`,
    },
  },
];

export const UI = {
  pt: {
    htmlLang: 'pt-BR',
    srTitle: 'Filipe Campos, desenvolvedor',
    explorer: 'Explorador',
    links: 'Links',
    language: 'Idioma',
    toggleExplorer: 'Mostrar ou esconder o explorador (Ctrl + B)',
    toggleTerminal: 'Abrir ou fechar o terminal (Ctrl + `)',
    closeExplorer: 'Fechar o explorador',
    minimize: 'Minimizar',
    maximize: 'Maximizar',
    restore: 'Restaurar',
    close: 'Fechar',
    closeTab: (name) => `Fechar ${name}`,
    run: 'Executar',
    terminal: 'Terminal',
    bugs: (n) => (n ? `${n} ${n > 1 ? 'bugs soltos no código. Clique neles' : 'bug solto no código. Clique nele'} pra esmagar.` : '0 bugs (por enquanto)'),
    bugsArrived: 'Apareceram bugs no código!',
    bugsArrivedText: 'Clique neles pra esmagar. Cada arquivo novo que você abre pode trazer mais um.',
    achievements: 'Conquistas',
    achievementUnlocked: 'Conquista desbloqueada',
    achievementsProgress: (d, t) => `${d} de ${t} desbloqueadas`,
    openAchievements: 'Ver conquistas',
    secretTitle: 'Conquista secreta',
    secretText: 'Continue explorando...',
    unlocked: 'desbloqueada',
    locked: 'bloqueada',
    npcLabel: 'NPC. Clique pra conversar, dois cliques pra mandar embora.',
    roomRole: 'Dev na LíderHub e criador do Debugando',
    roomHint: 'Clique no computador, na TV ou no videogame',
    actGames: 'Jogos',
    psGames: 'Jogos',
    psMedia: 'Mídia',
    psPlay: 'Jogar',
    psWatch: 'Assistir',
    psBack: 'Voltar',
    roomLoading: 'Montando o quarto...',
    roomNav: 'Atalhos do quarto',
    actPortfolio: 'Portfolio',
    backToRoom: 'Voltar pro quarto',
    room: { pc: 'Entrar no portfolio', tv: 'Debugando: abrir o canal', console: 'Videogame: escolher um jogo' },
    npc: {
      greet: 'Olá, viajante. Bem-vindo à casa do Filipe.',
      ambient: [
        'Belo dia pra ler um arquivo .yml, não acha?',
        'Dizem que os NPCs do GTA 6 não pensam. Eu também não.',
        'Eu ando pra lá e pra cá. É o meu trabalho.',
        'Já abriu o terminal? Eu não. Tenho medo.',
        'Se eu estiver atrapalhando, clica duas vezes em mim.',
        'Ouvi dizer que tem conquista secreta por aqui...',
        'Eu tô parado aqui desde 2024. Literalmente.',
      ],
      bump: 'Tem uma parede aqui? Vou continuar tentando.',
      bye: 'Tá bom, tô indo. Se quiser me chamar, digita npc no terminal.',
      back: 'Voltei! Sentiu minha falta?',
      here: 'Eu tô bem aqui.',
      clicks: ['Oi.', 'Oi.', 'Belo dia, né?', 'Belo dia, né?', 'Eu já disse isso?', 'Para de clicar em mim.', '...', '...', '......', 'Tá bom, você venceu.', 'Eu não tenho mais falas.'],
      about: 'Esse é o Filipe. Ou pelo menos o arquivo dele.',
      liderhub: 'LíderHub! Eu queria um agente de IA pra falar por mim.',
      debugando: 'Esse canal explica como os jogos funcionam por dentro. Inclusive eu.',
      'deploy-de-sexta': 'Deploy na sexta? Nem os NPCs fazem isso.',
      'mike-on-mars': 'Marte! Eu nunca saí dessa janela.',
      contact: 'Fala com ele no LinkedIn. Eu tentei, mas NPC não tem perfil.',
      achievements: 'Olha quanta conquista. Eu tenho zero.',
      bug: ['Ei! Esse bug era meu amigo.', 'Menos um. Faltam... eu não sei contar.', 'Isso foi um bug ou uma feature?'],
      allBugs: 'Você esmagou todos. Você é o escolhido.',
      terminal: 'Isso aí é o terminal. Eu não sei ler.',
      lang: 'Agora em português! Eu sabia o tempo todo.',
    },
    reopen: 'Abrir o portfolio',
    newTab: 'abre em nova aba',
    welcomeSub: 'Dev na LíderHub e criador do Debugando',
    welcomeStart: 'Começar',
    welcomeOpen: (name) => `Abrir ${name}`,
    welcomeTerminal: 'Abrir o terminal',
    welcomeExplorer: 'Mostrar o explorador',
    term: {
      welcome: 'Digite help pra ver os comandos.',
      help: [
        'whoami            quem sou eu',
        'ls [pasta]        lista os arquivos',
        'cat <arquivo>     abre um arquivo no editor',
        './contato.sh      fala comigo pelo LinkedIn',
        'github            abre meu GitHub',
        'linkedin          abre meu LinkedIn',
        'youtube           abre o Debugando',
        'lang <pt|en>      troca o idioma',
        'deploy            faz deploy (cuidado se for sexta)',
        'conquistas        mostra suas conquistas',
        'npc               chama o NPC de volta',
        'clear             limpa o terminal',
        'exit              fecha o terminal',
      ],
      whoami: 'Filipe Campos: dev na LíderHub e criador do Debugando.',
      notFound: (cmd) => `comando não encontrado: ${cmd}. Digite help.`,
      noFile: (cmd, f) => `${cmd}: ${f}: arquivo não encontrado`,
      noDir: (d) => `ls: ${d}: pasta não encontrada`,
      isDir: (cmd, d) => `${cmd}: ${d}: é uma pasta. Tente ls ${d}`,
      missingArg: (cmd) => `uso: ${cmd} <arquivo>`,
      opening: (f) => `abrindo ${f}...`,
      sudo: 'filipe não está no arquivo sudoers. Esse incidente será reportado.',
      deployFriday: 'Hoje é sexta. Deploy, nem pensar.',
      deployOther: 'Deploy feito! (mentira, isso aqui é só um portfolio)',
      deployPlay: 'Quer sentir o drama? Jogue Deploy de Sexta: ',
      langChanged: 'idioma: português',
      langUsage: 'uso: lang pt | lang en',
      contact: 'Abrindo o LinkedIn do Filipe... ',
      npc: 'chamando o NPC...',
    },
  },
  en: {
    htmlLang: 'en',
    srTitle: 'Filipe Campos, developer',
    explorer: 'Explorer',
    links: 'Links',
    language: 'Language',
    toggleExplorer: 'Show or hide the explorer (Ctrl + B)',
    toggleTerminal: 'Open or close the terminal (Ctrl + `)',
    closeExplorer: 'Close the explorer',
    minimize: 'Minimize',
    maximize: 'Maximize',
    restore: 'Restore',
    close: 'Close',
    closeTab: (name) => `Close ${name}`,
    run: 'Run',
    terminal: 'Terminal',
    bugs: (n) => (n ? `${n} ${n > 1 ? 'bugs' : 'bug'} loose in the code. Click to squash.` : '0 bugs (so far)'),
    bugsArrived: 'Bugs showed up in the code!',
    bugsArrivedText: 'Click them to squash. Every new file you open may bring another one.',
    achievements: 'Achievements',
    achievementUnlocked: 'Achievement unlocked',
    achievementsProgress: (d, t) => `${d} of ${t} unlocked`,
    openAchievements: 'View achievements',
    secretTitle: 'Secret achievement',
    secretText: 'Keep exploring...',
    unlocked: 'unlocked',
    locked: 'locked',
    npcLabel: 'NPC. Click to chat, double-click to send him away.',
    roomRole: 'Developer at LíderHub and creator of Debugando',
    roomHint: 'Click the computer, the TV or the console',
    actGames: 'Games',
    psGames: 'Games',
    psMedia: 'Media',
    psPlay: 'Play',
    psWatch: 'Watch',
    psBack: 'Back',
    roomLoading: 'Setting up the room...',
    roomNav: 'Room shortcuts',
    actPortfolio: 'Portfolio',
    backToRoom: 'Back to the room',
    room: { pc: 'Enter the portfolio', tv: 'Debugando: open the channel', console: 'Console: pick a game' },
    npc: {
      greet: "Hello, traveler. Welcome to Filipe's place.",
      ambient: [
        'Nice day to read a .yml file, huh?',
        "They say GTA 6 NPCs don't think. Neither do I.",
        "I walk back and forth. It's my job.",
        "Have you opened the terminal? I haven't. I'm scared.",
        "If I'm in the way, double-click me.",
        'I heard there are secret achievements around here...',
        "I've been standing here since 2024. Literally.",
      ],
      bump: "Is there a wall here? I'll keep trying.",
      bye: "Fine, I'm leaving. Type npc in the terminal to call me back.",
      back: "I'm back! Did you miss me?",
      here: "I'm right here.",
      clicks: ['Hi.', 'Hi.', 'Nice day, huh?', 'Nice day, huh?', 'Did I say that already?', 'Stop clicking me.', '...', '...', '......', 'Fine, you win.', "I'm out of lines."],
      about: "That's Filipe. Or at least his file.",
      liderhub: 'LíderHub! I wish I had an AI agent to talk for me.',
      debugando: 'This channel explains how games work on the inside. Including me.',
      'deploy-de-sexta': 'Deploying on a Friday? Not even NPCs do that.',
      'mike-on-mars': 'Mars! I have never left this window.',
      contact: "Reach him on LinkedIn. I tried, but NPCs don't get profiles.",
      achievements: 'Look at all those achievements. I have zero.',
      bug: ['Hey! That bug was my friend.', "One less. Only... I can't count.", 'Was that a bug or a feature?'],
      allBugs: 'You squashed them all. You are the chosen one.',
      terminal: "That's the terminal. I can't read.",
      lang: 'English now! I knew it all along.',
    },
    reopen: 'Open the portfolio',
    newTab: 'opens in a new tab',
    welcomeSub: 'Developer at LíderHub and creator of Debugando',
    welcomeStart: 'Start',
    welcomeOpen: (name) => `Open ${name}`,
    welcomeTerminal: 'Open the terminal',
    welcomeExplorer: 'Show the explorer',
    term: {
      welcome: 'Type help to see the commands.',
      help: [
        'whoami            who am I',
        'ls [folder]       list the files',
        'cat <file>        open a file in the editor',
        './contact.sh      reach me on LinkedIn',
        'github            open my GitHub',
        'linkedin          open my LinkedIn',
        'youtube           open Debugando',
        'lang <pt|en>      switch language',
        'deploy            deploy (careful if it is Friday)',
        'achievements      show your achievements',
        'npc               call the NPC back',
        'clear             clear the terminal',
        'exit              close the terminal',
      ],
      whoami: 'Filipe Campos: developer at LíderHub and creator of Debugando.',
      notFound: (cmd) => `command not found: ${cmd}. Type help.`,
      noFile: (cmd, f) => `${cmd}: ${f}: no such file`,
      noDir: (d) => `ls: ${d}: no such folder`,
      isDir: (cmd, d) => `${cmd}: ${d}: is a folder. Try ls ${d}`,
      missingArg: (cmd) => `usage: ${cmd} <file>`,
      opening: (f) => `opening ${f}...`,
      sudo: 'filipe is not in the sudoers file. This incident will be reported.',
      deployFriday: "It's Friday. No deploys today.",
      deployOther: 'Deployed! (not really, this is just a portfolio)',
      deployPlay: 'Want to feel the drama? Play Deploy de Sexta: ',
      langChanged: 'language: English',
      langUsage: 'usage: lang pt | lang en',
      contact: "Opening Filipe's LinkedIn... ",
      npc: 'calling the NPC...',
    },
  },
};
