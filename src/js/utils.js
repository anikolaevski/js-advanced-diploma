export function calcTileType(index, boardSize) {
  // TODO: write logic here
  let x, y, ret;
  ret = 'center';
  y = Math.floor( index / boardSize );
  x = index - (y * boardSize);

  if( y == 0 && x == 0) { ret = 'top-left' };
  if( y == 0 && x !== 0 && x < boardSize ) { ret = 'top' };
  if( y == 0 && x == boardSize-1) { ret = 'top-right' };
  if( y !== 0 && y < boardSize && x == 0) { ret = 'left'};
  if( y !== 0 && y < boardSize && x == boardSize-1 ) { ret = 'right'};
  if( y == boardSize-1 && x == 0) { ret = 'bottom-left'};
  if( y == boardSize-1 && x !== 0 && x < boardSize ) { ret = 'bottom'};
  if( y == boardSize-1 && x == boardSize-1 ) { ret = 'bottom-right'};

  return ret;
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical'
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
