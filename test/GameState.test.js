import GameState from '../src/js/GameState';

test('Test GameState', () => {
  const a = 5;
  GameState.a = a;
  expect(GameState.a).toBe(a);
});
