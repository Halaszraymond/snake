/**
 * The snake itself: where it is, which way it is going, and what it does
 * when it moves. Knows nothing about food, score or drawing.
 *
 * Needs: geometry.js
 */
class Snake {
  constructor(cells, direction) {
    this.cells = cells.map(c => ({...c}));
    this.direction = {...direction};
    this.turns = [];
  }

  get head()   { return this.cells[0]; }
  get length() { return this.cells.length; }

  /**
   * Queue a turn rather than applying it now. Validating against the last
   * turn already queued — not the direction currently on screen — is what
   * stops two quick presses stacking into a reversal.
   */
  queueTurn(direction) {
    const last = this.turns.length ? this.turns[this.turns.length - 1] : this.direction;
    if (opposite(direction, last) || same(direction, last)) return;
    if (this.turns.length < 2) this.turns.push(direction);
  }

  /** Take one turn off the queue and report where the head would land. */
  nextHead() {
    if (this.turns.length) this.direction = this.turns.shift();
    return {
      x: this.head.x + this.direction.x,
      y: this.head.y + this.direction.y
    };
  }

  /**
   * Would moving into this cell be a crash? The tail square is vacated on the
   * same tick the head arrives, so it only counts while the snake is growing,
   * when the tail stays put.
   */
  crashesInto(cell, growing) {
    const body = growing ? this.cells : this.cells.slice(0, -1);
    return body.some(c => same(c, cell));
  }

  covers(cell) {
    return this.cells.some(c => same(c, cell));
  }

  moveTo(cell, grow) {
    this.cells.unshift(cell);
    if (!grow) this.cells.pop();
  }
}
