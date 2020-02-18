import GameState from '../src/js/GameState';

test('Test GameState', () => {
  const a = { name: 'player', type: 1 };
  GameState.a = a;
  expect(GameState.a).toEqual(a);
});

test('Test GameState return', () => {
  const a = { name: 'player', type: 1 };
  expect(GameState.from(a)).toEqual(null);
});
