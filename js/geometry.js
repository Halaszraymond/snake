// Grid directions and cell comparisons, shared by Snake and Game.

const DIRECTIONS = {
  ArrowUp:    {x:  0, y: -1},
  ArrowDown:  {x:  0, y:  1},
  ArrowLeft:  {x: -1, y:  0},
  ArrowRight: {x:  1, y:  0}
};

const same     = (a, b) => a.x === b.x && a.y === b.y;
const opposite = (a, b) => a.x === -b.x && a.y === -b.y;
