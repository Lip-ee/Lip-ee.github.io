// Terminal de brincadeira: entende alguns comandos e abre arquivos no editor.

const PROMPT = 'filipe@portfolio:~$';

export function createTerminal(ctx) {
  const scroller = document.getElementById('term');
  const out = document.getElementById('term-out');
  const form = document.getElementById('term-form');
  const input = document.getElementById('term-input');

  const history = [];
  let historyIndex = 0;
  let greeted = false;

  const T = () => ctx.ui().term;

  function row(cls = '') {
    const div = document.createElement('div');
    div.className = cls ? `term-row ${cls}` : 'term-row';
    out.append(div);
    return div;
  }

  const print = (text, cls) => (row(cls).textContent = text);

  function printLink(text, url, label = url) {
    const div = row();
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = label;
    div.append(text, a);
  }

  function echo(command) {
    const div = row('term-cmd');
    const prompt = document.createElement('span');
    prompt.className = 'term-prompt';
    prompt.textContent = PROMPT;
    div.append(prompt, ` ${command}`);
  }

  const scrollDown = () => (scroller.scrollTop = scroller.scrollHeight);

  // Aceita o nome em qualquer idioma, com ou sem pasta: sobre.md, ./projetos/mike-on-mars.gd, about...
  function findFile(arg) {
    const wanted = arg.replace(/^(~\/|\.\/)/, '').toLowerCase();
    return ctx.files.find((f) =>
      ['pt', 'en'].some((lang) => {
        const name = f.name[lang].toLowerCase();
        const path = f.folder ? `${ctx.folders[f.folder][lang]}/${name}` : name;
        return wanted === name || wanted === path || wanted === f.id;
      })
    );
  }

  function findFolder(arg) {
    const wanted = arg.replace(/^(~\/|\.\/)/, '').replace(/\/$/, '').toLowerCase();
    return Object.keys(ctx.folders).find(
      (key) => key === wanted || ctx.folders[key].pt === wanted || ctx.folders[key].en === wanted
    );
  }

  function listNames(names) {
    const div = row('term-ls');
    for (const { name, dir } of names) {
      const s = document.createElement('span');
      s.textContent = name;
      if (dir) s.className = 'term-dir';
      div.append(s);
    }
  }

  function ls(args) {
    const lang = ctx.lang();
    const byName = (a, b) => a.name.localeCompare(b.name);
    if (args[0]) {
      const folder = findFolder(args[0]);
      if (!folder) return print(T().noDir(args[0]), 'term-err');
      return listNames(ctx.files.filter((f) => f.folder === folder).map((f) => ({ name: f.name[lang] })).sort(byName));
    }
    const dirs = Object.values(ctx.folders).map((f) => ({ name: `${f[lang]}/`, dir: true })).sort(byName);
    const files = ctx.files.filter((f) => !f.folder && !f.hidden).map((f) => ({ name: f.name[lang] })).sort(byName);
    listNames([...dirs, ...files]);
  }

  function cat(args, cmd) {
    if (!args[0]) return print(T().missingArg(cmd), 'term-err');
    if (findFolder(args[0])) return print(T().isDir(cmd, args[0]), 'term-err');
    const file = findFile(args[0]);
    if (!file) return print(T().noFile(cmd, args[0]), 'term-err');
    print(T().opening(ctx.filePath(file)), 'term-dim');
    ctx.open(file.id);
  }

  function openLink(id) {
    const link = ctx.links.find((l) => l.id === id);
    window.open(link.url, '_blank', 'noopener');
    printLink('→ ', link.url);
  }

  function runContact() {
    const linkedin = ctx.links.find((l) => l.id === 'linkedin').url;
    window.open(linkedin, '_blank', 'noopener');
    printLink(T().contact, linkedin);
  }

  function deploy() {
    if (new Date().getDay() === 5) print(T().deployFriday, 'term-err');
    else print(T().deployOther, 'term-ok');
    printLink(T().deployPlay, 'https://lip-ee.github.io/deploy-de-sexta/');
  }

  function lang(args) {
    if (args[0] !== 'pt' && args[0] !== 'en') return print(T().langUsage, 'term-err');
    ctx.setLang(args[0]);
    print(T().langChanged, 'term-dim');
  }

  const COMMANDS = {
    help: () => T().help.forEach((line) => print(line)),
    whoami: () => print(T().whoami),
    ls,
    cat,
    github: () => openLink('github'),
    linkedin: () => openLink('linkedin'),
    youtube: () => openLink('youtube'),
    lang,
    deploy,
    pwd: () => print(`~/${ctx.root}`),
    echo: (args) => print(args.join(' ')),
    date: () => print(new Date().toLocaleString(ctx.ui().htmlLang)),
    sudo: () => print(T().sudo, 'term-err'),
    clear: () => out.replaceChildren(),
    exit: () => ctx.close(),
    achievements: () => ctx.open('achievements'),
    npc: () => print(T().npc, 'term-dim'),
  };

  const ALIASES = { ajuda: 'help', open: 'cat', code: 'cat', idioma: 'lang', limpar: 'clear', cls: 'clear', sair: 'exit', conquistas: 'achievements', trophies: 'achievements' };

  function exec(line) {
    const [cmd, ...args] = line.split(/\s+/);
    if (/^(\.\/|sh |bash )?(contato|contact)\.sh$/i.test(line)) {
      ctx.onCommand('contact');
      return runContact();
    }
    const name = ALIASES[cmd.toLowerCase()] || cmd.toLowerCase();
    ctx.onCommand(name);
    if (COMMANDS[name]) return COMMANDS[name](args, cmd);
    print(T().notFound(cmd), 'term-err');
  }

  function run(line) {
    echo(line);
    const trimmed = line.trim();
    if (trimmed) {
      history.push(trimmed);
      historyIndex = history.length;
      exec(trimmed);
    }
    scrollDown();
  }

  function completions(word, isFirst) {
    const lang = ctx.lang();
    if (isFirst) {
      const contact = ctx.files.find((f) => f.runnable).name[lang];
      return [...Object.keys(COMMANDS), `./${contact}`];
    }
    const folders = Object.values(ctx.folders).map((f) => `${f[lang]}/`);
    const paths = ctx.files.map((f) => ctx.filePath(f));
    return word.includes('/') ? paths : [...folders, ...ctx.files.filter((f) => !f.folder && !f.hidden).map((f) => f.name[lang])];
  }

  function complete() {
    const parts = input.value.split(' ');
    const word = parts.pop();
    const matches = completions(word, parts.length === 0).filter((c) => c.startsWith(word));
    if (matches.length === 1) {
      parts.push(matches[0]);
      input.value = parts.join(' ') + (matches[0].endsWith('/') ? '' : ' ');
    } else if (matches.length > 1) {
      echo(input.value);
      print(matches.join('   '), 'term-dim');
      scrollDown();
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const line = input.value;
    input.value = '';
    run(line);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      form.requestSubmit();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      complete();
    } else if (e.key === 'ArrowUp' && historyIndex > 0) {
      e.preventDefault();
      input.value = history[--historyIndex];
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      historyIndex = Math.min(historyIndex + 1, history.length);
      input.value = history[historyIndex] ?? '';
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      out.replaceChildren();
    }
  });

  // Clicar em qualquer lugar do terminal foca o campo, menos quando é um link.
  scroller.addEventListener('click', (e) => {
    if (!e.target.closest('a') && !window.getSelection().toString()) input.focus();
  });

  return {
    show({ focus = true } = {}) {
      if (!greeted) {
        print(T().welcome, 'term-dim');
        greeted = true;
      }
      if (focus) input.focus({ preventScroll: true });
      scrollDown();
    },
    run,
  };
}
