// Entry point: build the game, wire up the keyboard, start the clock.
// Loaded last, once every class above it exists.

const game = new Game(
  new Board(COLS, ROWS),
  new Renderer(document.getElementById('board'), CELL),
  document.getElementById('score')
);

document.addEventListener('keydown', e => {
  if (game.handleKey(e.key)) e.preventDefault();
});

setInterval(() => game.step(), SPEED);
