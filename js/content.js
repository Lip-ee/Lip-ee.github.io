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
};

export const FILES = [
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
  - titulo: "PEDI PRO CLAUDE FAZER O GTA | FABLE 5.2"
    link: https://youtu.be/rAalgQVhcyk
  - titulo: "POR QUE O GTA 6 É TÃO PESADO?"
    link: https://youtu.be/MGvE1C84lk0
  - titulo: "O GTA 6 VAI PARAR O MUNDO"
    link: https://youtu.be/hu-RyoCBYhc`,
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
  - title: "PEDI PRO CLAUDE FAZER O GTA | FABLE 5.2"
    link: https://youtu.be/rAalgQVhcyk
  - title: "POR QUE O GTA 6 É TÃO PESADO?"
    link: https://youtu.be/MGvE1C84lk0
  - title: "O GTA 6 VAI PARAR O MUNDO"
    link: https://youtu.be/hu-RyoCBYhc`,
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
    bugs: '0 bugs (por enquanto)',
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
    bugs: '0 bugs (so far)',
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
    },
  },
};
