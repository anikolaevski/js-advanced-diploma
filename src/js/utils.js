export function calcTileType(index, boardSize) {
  // TODO: write logic here
  let ret;
  ret = 'center';
  const y = Math.floor(index / boardSize);
  const x = index - (y * boardSize);

  if (y === 0 && x === 0) { ret = 'top-left'; }
  if (y === 0 && x !== 0 && x < boardSize) { ret = 'top'; }
  if (y === 0 && x === boardSize - 1) { ret = 'top-right'; }
  if (y !== 0 && y < boardSize && x === 0) { ret = 'left'; }
  if (y !== 0 && y < boardSize && x === boardSize - 1) { ret = 'right'; }
  if (y === boardSize - 1 && x === 0) { ret = 'bottom-left'; }
  if (y === boardSize - 1 && x !== 0 && x < boardSize) { ret = 'bottom'; }
  if (y === boardSize - 1 && x === boardSize - 1) { ret = 'bottom-right'; }

  return ret;
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

/*
* Calculate range in fields between two units
* index1 - index of unit #1
* index2 - index of unit #2
* boardSize - size if game board
*/
export function calcRange(index1, index2, boardSize) {
  const y1 = Math.floor(index1 / boardSize);
  const x1 = index1 - (y1 * boardSize);
  const y2 = Math.floor(index2 / boardSize);
  const x2 = index2 - (y2 * boardSize);
  const ret = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
  return ret;
}

/*
* Calculate next field for automated unit move
* index1 - index of automated unit
* index2 - index to closest player's unit
* range - moving range of automated unit
* attackrange - attack range of automated unit
* boardSize - size if game board
*/
export function calcNextMoveStep(index1, index2, range, attackrange, boardSize) {
  const y1 = Math.floor(index1 / boardSize);
  const x1 = index1 - (y1 * boardSize);
  const y2 = Math.floor(index2 / boardSize);
  const x2 = index2 - (y2 * boardSize);
  const outx = Math.sign(x2 - x1) * Math.min(Math.abs(x2 - x1), range, attackrange);
  const outy = Math.sign(y2 - y1) * Math.min(Math.abs(y2 - y1), range, attackrange);
  // console.log(outy, outx);
  return (y1 + outy) * boardSize + x1 + outx;
}
