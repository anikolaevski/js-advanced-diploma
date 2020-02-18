import GamePlay from '../src/js/GamePlay';

document.body.innerHTML = '<div id="game-container"></div>';
const gamePlay = new GamePlay();
const gameContainer = document.querySelector('#game-container');

test.each([
  ['.controls'],
  ['[data-id=action-restart]'],
  ['[data-id=action-save]'],
  ['[data-id=action-load]'],
  ['.board-container'],
  ['[data-id=board]'],
])(('Test UI control %s'), (inp) => {
  gamePlay.bindToDOM(gameContainer);
  gamePlay.drawUi();
  expect(!!(gameContainer.querySelector(inp))).toBe(true);
});
