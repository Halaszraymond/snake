# Snake

The classic Snake, in the browser. Open `index.html` — no server, no build
step, no dependencies.

Arrow keys to steer, R to restart. Eat the red food to grow; hit a wall or
yourself and it's game over. Fill the whole 20×20 board and you win.

## Structure

Plain `<script src>` tags rather than ES modules — a page opened straight
from disk (`file://`) has a null origin, and modules are fetched under CORS
rules that refuse to load in that case. Classic scripts aren't subject to
that, so double-clicking `index.html` just works. Load order in
[index.html](index.html) matters: each file uses what the ones above it
define.

- [`js/config.js`](js/config.js) — tuning knobs (grid size, cell size, speed)
- [`js/geometry.js`](js/geometry.js) — directions and cell comparisons
- [`js/snake.js`](js/snake.js) — the snake: position, movement, turning
- [`js/board.js`](js/board.js) — the grid and where food may appear
- [`js/renderer.js`](js/renderer.js) — drawing; reads state, never changes it
- [`js/game.js`](js/game.js) — rules, score, and game-over/win state
- [`js/main.js`](js/main.js) — builds the game, wires up input, starts the clock

## Known limitations

- The canvas is a fixed 400×400px and does not adapt to narrow windows.
- Keyboard-only; no touch controls.

See [NOTES.md](NOTES.md) for the build log — how this was developed and
tested by prompting an agent, including the bugs that were found and why.
