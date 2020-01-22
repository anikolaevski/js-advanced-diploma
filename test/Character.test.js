/* eslint-disable no-unused-vars */
import Character from '../src/js/Character';

test('Test create character', () => {
  const expected = "Parent class instances creation isn't permitted";
  expect(() => {
    const a = new Character(1);
  }).toThrow(expected);
});
