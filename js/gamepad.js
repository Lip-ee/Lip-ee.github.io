// Controle de videogame pela Gamepad API (layout padrão: Xbox, PlayStation, Switch Pro...).
// Converte botões e analógico em eventos simples: 'a', 'b', 'start', 'up', 'down', 'left', 'right'.

const BUTTONS = { 0: 'a', 1: 'b', 9: 'start', 12: 'up', 13: 'down', 14: 'left', 15: 'right' };
const DIRECTIONS = ['up', 'down', 'left', 'right'];
const DEAD_ZONE = 0.5;
const REPEAT_DELAY = 380; // segurar a direção repete, como no menu de um console
const REPEAT_RATE = 150;

export function watchGamepad({ onPress, onConnect }) {
  if (!navigator.getGamepads) return;
  const held = new Map();
  let polling = false;

  function poll(now) {
    const pads = [...navigator.getGamepads()].filter(Boolean);
    const down = new Set();
    for (const pad of pads) {
      pad.buttons.forEach((b, i) => b.pressed && BUTTONS[i] && down.add(BUTTONS[i]));
      const [x = 0, y = 0] = pad.axes;
      if (x < -DEAD_ZONE) down.add('left');
      else if (x > DEAD_ZONE) down.add('right');
      if (y < -DEAD_ZONE) down.add('up');
      else if (y > DEAD_ZONE) down.add('down');
    }
    for (const name of down) {
      if (!held.has(name)) {
        held.set(name, now + REPEAT_DELAY);
        onPress(name);
      } else if (DIRECTIONS.includes(name) && now >= held.get(name)) {
        held.set(name, now + REPEAT_RATE);
        onPress(name);
      }
    }
    for (const name of [...held.keys()]) if (!down.has(name)) held.delete(name);

    polling = pads.length > 0;
    if (polling) requestAnimationFrame(poll);
  }

  addEventListener('gamepadconnected', () => {
    onConnect?.();
    if (!polling) {
      polling = true;
      requestAnimationFrame(poll);
    }
  });
}
