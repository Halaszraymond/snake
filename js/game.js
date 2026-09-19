/**
 * Ties it together: the rules, the score, and whether the game is over.
 *
 * Needs: geometry.js, snake.js
 */
class Game {
  constructor(board, renderer, scoreEl) {
    this.board = board;
    this.renderer = renderer;
    this.scoreEl = scoreEl;
    this.reset();
  }

  reset() {
    this.snake = new Snake(
      [{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}],
      {x: 1, y: 0}
    );
    this.score = 0;
    this.state = 'playing';
    this.food = this.board.freeCell(this.snake);
    this.showScore();
    this.draw();
  }

  step() {
    if (this.state !== 'playing') return;

    const head = this.snake.nextHead();
    const eating = same(head, this.food);

    if (!this.board.contains(head) || this.snake.crashesInto(head, eating)) {
      this.state = 'dead';
      this.draw();
      return;
    }

    this.snake.moveTo(head, eating);

    if (eating) {
      this.score++;
      this.showScore();

      // Filling the board is a win. Asking for another food cell here would
      // never return, because there is no empty square left.
      if (this.snake.length === this.board.area) {
        this.state = 'won';
        this.draw();
        return;
      }

      this.food = this.board.freeCell(this.snake);
    }

    this.draw();
  }

  handleKey(key) {
    if (key === 'r' || key === 'R') {
      this.reset();
      return true;
    }
    if (DIRECTIONS[key]) {
      this.snake.queueTurn(DIRECTIONS[key]);
      return true;
    }
    return false;
  }

  showScore() { this.scoreEl.textContent = 'Score: ' + this.score; }
  draw()      { this.renderer.draw(this); }
}
