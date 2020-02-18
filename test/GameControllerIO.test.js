import GamePlay from '../src/js/GamePlay';
import GameController from '../src/js/GameController';
import GameStateService from '../src/js/GameStateService';
import GameState from '../src/js/GameState';

document.body.innerHTML = '<div id="game-container"></div>';
const gamePlay = new GamePlay();
gamePlay.bindToDOM(document.querySelector('#game-container'));
const stateService = new GameStateService(sessionStorage);
const gameCtrl = new GameController(gamePlay, stateService);

test('Test saveGame', () => {
  const level = 1;
  gameCtrl.init(level);
  const jsdomAlert = window.alert;
  window.alert = () => {};
  gameCtrl.saveGame();
  window.alert = jsdomAlert;
  expect(JSON.parse(sessionStorage.state).turn).toBe('player');
});

test('Test loadGame', () => {
  const level = 1;
  gameCtrl.init(level);
  const jsdomAlert = window.alert;
  window.alert = () => {};
  gameCtrl.saveGame();
  window.alert = jsdomAlert;
  GameState.turn = 'opponent';
  gameCtrl.loadGame();
  expect(GameState.turn).toBe('player');
});
