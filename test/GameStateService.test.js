import GameStateService from '../src/js/GameStateService';

test('Load game invalid state', () => {
  const stateService = new GameStateService('{state: "}');
  const expected = 'Invalid state';
  expect(() => { stateService.load(); }).toThrow(expected);
});

test('Save game', () => {
  const storage = sessionStorage;
  const obj = { a: 1 };
  const stateService = new GameStateService(storage);
  stateService.save(obj);
  expect(JSON.parse(storage.state)).toEqual(obj);
});
