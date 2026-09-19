/**
 * Draws a game onto a canvas. Reads state, never changes it.
 */
class Renderer {
  constructor(canvas, cell) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.cell = cell;
  }

  draw(game) {
    const ctx = this.ctx;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle = '#e44';
    this.square(game.food);

    ctx.fillStyle = '#4c4';
    for (const c of game.snake.cells) this.square(c);

    if (game.state !== 'playing') this.overlay(game.state === 'won');
  }

  square(cell) {
    this.ctx.fillRect(cell.x * this.cell, cell.y * this.cell, this.cell, this.cell);
  }

  overlay(won) {
    const ctx = this.ctx;
    const midX = this.canvas.width / 2;
    const midY = this.canvas.height / 2;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle = won ? '#4c4' : '#fff';
    ctx.font = '32px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(won ? 'You win!' : 'Game Over', midX, midY - 10);

    ctx.fillStyle = '#fff';
    ctx.font = '16px monospace';
    ctx.fillText('press R to restart', midX, midY + 20);
  }
}
