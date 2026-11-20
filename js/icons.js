// Ícones em SVG inline: nada de requisição extra pra desenhar a interface.

const stroke = (body, size = 24) =>
  `<svg viewBox="0 0 ${size} ${size}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

const ICONS = {
  files: stroke(
    '<path d="M13.5 3H8a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V7.5z"/><path d="M13.5 3v4.5H18"/><path d="M7 7H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-3"/>'
  ),
  terminal: stroke('<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="m7 9.5 3 2.5-3 2.5M12.5 15H17"/>'),
  chevron: stroke('<path d="m9 6 6 6-6 6"/>'),
  close: stroke('<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>'),
  external: stroke('<path d="M14 4h6v6M20 4l-8.5 8.5M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
  play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>',
  github:
    '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>',
  linkedin:
    '<svg viewBox="0 0 16 16" aria-hidden="true"><rect width="16" height="16" rx="3" fill="#0a66c2"/><g fill="#fff"><circle cx="4.6" cy="4.4" r="1.45"/><rect x="3.4" y="6.4" width="2.4" height="6.6"/><path d="M7.4 6.4h2.3v.95c.38-.62 1.12-1.15 2.25-1.15 1.95 0 2.55 1.25 2.55 3.05V13h-2.4V9.75c0-.85-.2-1.5-1.05-1.5-.9 0-1.25.62-1.25 1.55V13H7.4z"/></g></svg>',
  youtube:
    '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x=".5" y="2.75" width="15" height="10.5" rx="3" fill="#ff0033"/><path d="M6.5 5.5v5l4.25-2.5z" fill="#fff"/></svg>',
};

export const icon = (name, cls = '') => {
  const svg = ICONS[name] || '';
  return cls ? `<span class="${cls}">${svg}</span>` : svg;
};
