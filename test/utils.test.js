import {
  calcTileType, calcHealthLevel, calcRange, calcNextMoveStep,
} from '../src/js/utils';
import { GlobalRules } from '../src/js/GameSetup';
// import { Swordsman } from '../src/js/GameClasses';

// class xxx {
//   constructor(a) {
//     this.x = a;
//   }
// }

test('Test calcTileType', () => {
  const ttypes = [
    'top-left',
    'top',
    'top',
    'top',
    'top',
    'top',
    'top',
    'top-right', // 0
    'left',
    'center',
    'center',
    'center',
    'center',
    'center',
    'center',
    'right', // 1
    'left',
    'center',
    'center',
    'center',
    'center',
    'center',
    'center',
    'right', // 2
    'left',
    'center',
    'center',
    'center',
    'center',
    'center',
    'center',
    'right', // 3
    'left',
    'center',
    'center',
    'center',
    'center',
    'center',
    'center',
    'right', // 4
    'left',
    'center',
    'center',
    'center',
    'center',
    'center',
    'center',
    'right', // 5
    'left',
    'center',
    'center',
    'center',
    'center',
    'center',
    'center',
    'right', // 6
    'bottom-left',
    'bottom',
    'bottom',
    'bottom',
    'bottom',
    'bottom',
    'bottom',
    'bottom-right', // 7
  ];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < ttypes.length; i++) {
    expect(calcTileType(i, GlobalRules.boardSize)).toEqual(ttypes[i]);
  }
});

test('Test calcHealthLevel', () => {
  const expected = [
    { health: 10, strval: 'critical' },
    { health: 30, strval: 'normal' },
    { health: 75, strval: 'high' },
  ];
  for (const exp of expected) {
    expect(calcHealthLevel(exp.health)).toBe(exp.strval);
  }
});

test('Test calcRange', () => {
  const src = [
    { index1: 9, index2: 21, range: 4 },
    { index1: 41, index2: 11, range: 4 },
  ];
  for (const item of src) {
    expect(calcRange(item.index1, item.index2, GlobalRules.boardSize)).toBe(item.range);
  }
});

test('Test calcNextMoveStep', () => {
  const src = [
    {
      index1: 21, index2: 9, range: 1, attackrange: 1, returnIndex: 12,
    },
    {
      index1: 21, index2: 9, range: 2, attackrange: 2, returnIndex: 11,
    },
  ];
  for (const item of src) {
    expect(calcNextMoveStep(
      item.index1, item.index2, item.range,
      item.attackrange, GlobalRules.boardSize,
    )).toBe(item.returnIndex);
  }
});
