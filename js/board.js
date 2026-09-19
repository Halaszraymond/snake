/**
 * The grid the snake lives on. Owns the bounds and where food can appear.
 */
class Board {
  constructor(cols, rows) {
    this.cols = cols;
    this.rows = rows;
  }

  get area() { return this.cols * this.rows; }

  contains(cell) {
    return cell.x >= 0 && cell.x < this.cols &&
           cell.y >= 0 && cell.y < this.rows;
  }

  /** Caller must ensure a free cell exists — a full board would spin here. */
  freeCell(snake) {
    let cell;
    do {
      cell = {
        x: Math.floor(Math.random() * this.cols),
        y: Math.floor(Math.random() * this.rows)
      };
    } while (snake.covers(cell));
    return cell;
  }
}
