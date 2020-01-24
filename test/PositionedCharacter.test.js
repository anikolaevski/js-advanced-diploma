import PositionedCharacter from '../src/js/PositionedCharacter';
import { Swordsman } from '../src/js/GameClasses';

class xxx {
  constructor(a) {
    this.x = a;
  }
}

test('Test PositionedCharacter', () => {
  const a = new Swordsman(1);
  const p = new PositionedCharacter(a, 0);
  expect(p.character.health).toEqual(50);
});

test('Test PositionedCharacter to throw 1', () => {
  const expected = 'character must be instance of Character or its children';
  expect(() => {
    // eslint-disable-next-line new-cap
    const a = new xxx('a');
    // eslint-disable-next-line no-unused-vars
    const p = new PositionedCharacter(a, 0);
  }).toThrow(expected);
});

test('Test PositionedCharacter to throw 2', () => {
  const expected = 'position must be a number';
  expect(() => {
    // eslint-disable-next-line new-cap
    const a = new Swordsman(1);
    // eslint-disable-next-line no-unused-vars
    const p = new PositionedCharacter(a, '0');
  }).toThrow(expected);
});
