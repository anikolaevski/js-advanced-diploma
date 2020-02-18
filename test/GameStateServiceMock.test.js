import GameStateService from '../src/js/GameStateService';

jest.mock('../src/js/GameStateService');

beforeEach(() => {
  jest.resetAllMocks();
});

test('Save game', () => {
  const stateService = new GameStateService({});
  GameStateService.mockReturnValue(JSON.stringify(stateService.save({})));
  expect(GameStateService).toBeCalledWith({});
});


test('Load game', () => {
  const stateService = new GameStateService({});
  GameStateService.mockReturnValue(JSON.stringify(stateService.load()));
  expect(GameStateService).toBeCalledWith({});
});

// test('abc', () => {
//   expect(1).toBe(1);
// });
