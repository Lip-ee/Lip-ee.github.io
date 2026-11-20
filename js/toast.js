// Notificações no canto da janela, no estilo das do VS Code.

const box = document.getElementById('toasts');

export function toast({ icon, title, text = '', variant = '', closeLabel = 'Fechar', duration = 6000 }) {
  const el = document.createElement('div');
  el.className = variant ? `toast toast-${variant}` : 'toast';
  el.setAttribute('role', 'status');
  el.innerHTML = `<span class="toast-icon" aria-hidden="true"></span>
    <div class="toast-body"><strong class="toast-title"></strong><span class="toast-text"></span></div>
    <button type="button" class="toast-close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/></svg></button>`;
  el.querySelector('.toast-icon').textContent = icon;
  el.querySelector('.toast-title').textContent = title;
  el.querySelector('.toast-text').textContent = text;

  const close = el.querySelector('.toast-close');
  close.setAttribute('aria-label', closeLabel);

  const dismiss = () => {
    el.classList.add('is-leaving');
    setTimeout(() => el.remove(), 250);
  };
  close.addEventListener('click', dismiss);
  setTimeout(dismiss, duration);

  box.append(el);
  return el;
}
