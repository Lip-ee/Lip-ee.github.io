// Colorizador simples, linha a linha. Não é um parser de verdade:
// só cobre o que os arquivos do portfolio usam.

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
export const escapeHTML = (text) => text.replace(/[&<>"]/g, (c) => ESCAPES[c]);

const URL_RE = /https?:\/\/[^\s"'<>)]+/g;

// Transforma URLs soltas no texto em links que abrem em outra aba.
function linkify(text) {
  let html = '';
  let last = 0;
  for (const m of text.matchAll(URL_RE)) {
    html += escapeHTML(text.slice(last, m.index));
    html += `<a href="${escapeHTML(m[0])}" target="_blank" rel="noopener">${escapeHTML(m[0])}</a>`;
    last = m.index + m[0].length;
  }
  return html + escapeHTML(text.slice(last));
}

const span = (cls, text, withLinks = false) =>
  `<span class="t-${cls}">${withLinks ? linkify(text) : escapeHTML(text)}</span>`;

const linkSpan = (cls) => (m) => span(cls, m[0], true);

// Percorre a linha testando as regras na ordem; o que nenhuma regra pega sai sem cor.
function tokenize(line, rules) {
  let html = '';
  let plain = '';
  let i = 0;
  outer: while (i < line.length) {
    for (const [re, cls] of rules) {
      re.lastIndex = i;
      const m = re.exec(line);
      if (m && m[0].length) {
        html += escapeHTML(plain);
        plain = '';
        html += typeof cls === 'function' ? cls(m) : cls === 'plain' ? escapeHTML(m[0]) : span(cls, m[0]);
        i += m[0].length;
        continue outer;
      }
    }
    plain += line[i++];
  }
  return html + escapeHTML(plain);
}

const STRING = /"(?:[^"\\]|\\.)*"/y;
const WORD = /[A-Za-z_À-ÿ][\wÀ-ÿ]*/y;

const TS = [
  [/\/\/.*/y, 'comment'],
  [STRING, linkSpan('string')],
  [/\b(?:export|import|from|const|let|type|as|return|function)\b/y, 'keyword'],
  [/[A-Za-z_]\w*(?=\s*:)/y, 'prop'],
  [WORD, 'plain'],
  [/\d+/y, 'number'],
];

const GD = [
  [/#.*/y, 'comment'],
  [STRING, linkSpan('string')],
  [/\b(?:extends|func|var|const|while|not|if|for|in|return|pass)\b/y, 'keyword'],
  [/[A-Za-z_]\w*(?=\()/y, 'func'],
  [/\b[A-Z][A-Z0-9_]+\b/y, 'constant'],
  [/\b[A-Z]\w*/y, 'type'],
  [WORD, 'plain'],
  [/\d+/y, 'number'],
];

const SH = [
  [/#.*/y, 'comment'],
  [/"(?:[^"\\$]|\\.)*"/y, linkSpan('string')],
  [/"/y, 'string'],
  [/\$\{?\w+\}?/y, 'variable'],
  [/\b(?:echo|xdg-open|export)\b/y, 'func'],
  [/[A-Z_]+(?==)/y, 'variable'],
  [WORD, 'plain'],
];

const MD_INLINE = [
  [/\*\*[^*]+\*\*/y, 'bold'],
  [/`[^`]+`/y, 'code'],
  [
    /\[([^\]]+)\]\(([^)]+)\)/y,
    (m) => {
      const external = /^https?:/.test(m[2]) ? ' target="_blank" rel="noopener"' : '';
      return (
        span('punct', '[') +
        `<a class="t-link" href="${escapeHTML(m[2])}"${external}>${escapeHTML(m[1])}</a>` +
        span('punct', '](') +
        span('url', m[2]) +
        span('punct', ')')
      );
    },
  ],
];

function markdown(line) {
  if (/^#{1,6} /.test(line)) return span('heading', line);
  if (/^<!--.*-->$/.test(line)) return span('comment', line);
  if (line.startsWith('> ')) return span('punct', '> ') + span('quote', line.slice(2));
  const bullet = line.match(/^\s*[-*] /);
  if (bullet) return span('punct', bullet[0]) + tokenize(line.slice(bullet[0].length), MD_INLINE);
  return tokenize(line, MD_INLINE);
}

function yamlValue(value) {
  const lead = value.match(/^\s*/)[0];
  const rest = value.slice(lead.length);
  if (!rest) return lead;
  if (/^\d+(\s|$)/.test(rest)) {
    const [, num, tail] = rest.match(/^(\d+)(.*)$/);
    return lead + span('number', num) + span('value', tail);
  }
  return lead + span(rest.startsWith('"') ? 'string' : 'value', rest, true);
}

function yaml(line) {
  if (/^\s*#/.test(line)) return span('comment', line);
  const pair = line.match(/^(\s*)(- )?([\w-]+)(:)(.*)$/);
  if (pair) {
    const [, indent, dash, key, colon, value] = pair;
    return indent + (dash ? span('punct', dash) : '') + span('key', key) + span('punct', colon) + yamlValue(value);
  }
  const item = line.match(/^(\s*)(- )(.*)$/);
  if (item) return item[1] + span('punct', item[2]) + yamlValue(item[3]);
  return escapeHTML(line);
}

const HIGHLIGHTERS = {
  md: markdown,
  yml: yaml,
  ts: (line) => tokenize(line, TS),
  gd: (line) => tokenize(line, GD),
  sh: (line) => tokenize(line, SH),
};

export const highlight = (line, lang) => (HIGHLIGHTERS[lang] || escapeHTML)(line);
