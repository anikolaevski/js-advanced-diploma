import GamePlay from '../src/js/GamePlay';
import themes from '../src/js/themes';
import GameStateService from '../src/js/GameStateService';
import GameController from '../src/js/GameController';
import {
  createTeams,
} from '../src/js/GameSetup';

document.body.innerHTML = '<div id="game-container"></div>';
const gamePlay = new GamePlay();
const gameContainer = document.querySelector('#game-container');
const stateService = new GameStateService(sessionStorage);
const gameCtrl = new GameController(gamePlay, stateService);

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

test.each([
  ['.character'],
  ['.health-level'],
  ['.health-level-indicator'],
])(('Test RedrawPositions %s'), (inp) => {
  const level = 1;
  const theme = themes.find(o => o.level === level);
  gameCtrl.pos = createTeams(theme.level);
  gameCtrl.gamePlay.drawUi(theme.name);
  gameCtrl.gamePlay.redrawPositions(gameCtrl.pos);
  expect(!!(gameContainer.querySelector(inp))).toBe(true);
});

test('Test selectCell', () => {
  const level = 1;
  const theme = themes.find(o => o.level === level);
  gameCtrl.pos = createTeams(theme.level);
  gameCtrl.gamePlay.drawUi(theme.name);
  gameCtrl.gamePlay.redrawPositions(gameCtrl.pos);
  gameCtrl.gamePlay.selectCell(19, 'yellow');
  expect(!!(gameContainer.querySelector('.selected'))).toBe(true);
  expect(!!(gameContainer.querySelector('.selected-yellow'))).toBe(true);
});

test('Test deselectCell', () => {
  const level = 1;
  const theme = themes.find(o => o.level === level);
  gameCtrl.pos = createTeams(theme.level);
  gameCtrl.gamePlay.drawUi(theme.name);
  gameCtrl.gamePlay.redrawPositions(gameCtrl.pos);
  gameCtrl.gamePlay.selectCell(19, 'yellow');
  const x = () => {
    expect(!!(gameContainer.querySelector('.selected'))).toBe(false);
    expect(!!(gameContainer.querySelector('.selected-yellow'))).toBe(false);
  };
  setTimeout(x, 500);
});

test('Test showCellTooltip', () => {
  const index = 19;
  const message = 'this is a cell';
  const level = 1;
  const theme = themes.find(o => o.level === level);
  gameCtrl.pos = createTeams(theme.level);
  gameCtrl.gamePlay.drawUi(theme.name);
  gameCtrl.gamePlay.redrawPositions(gameCtrl.pos);
  gameCtrl.gamePlay.showCellTooltip(message, index);
  expect(gameCtrl.gamePlay.cells[index].title).toBe(message);
});

test('Test hideCellTooltip', () => {
  const index = 19;
  const message = 'this is a cell';
  const level = 1;
  const theme = themes.find(o => o.level === level);
  gameCtrl.pos = createTeams(theme.level);
  gameCtrl.gamePlay.drawUi(theme.name);
  gameCtrl.gamePlay.redrawPositions(gameCtrl.pos);
  gameCtrl.gamePlay.showCellTooltip(message, index);
  gameCtrl.gamePlay.hideCellTooltip(index);
  const x = () => {
    expect(gameCtrl.gamePlay.cells[index].title).toBe(message);
  };
  setTimeout(x, 500);
});

test.each([
  ['auto'],
  ['pointer'],
  ['crosshair'],
  ['not-allowed'],
])(('Test setCursor %s'), (inp) => {
  const level = 1;
  const theme = themes.find(o => o.level === level);
  gameCtrl.pos = createTeams(theme.level);
  gameCtrl.gamePlay.drawUi(theme.name);
  gameCtrl.gamePlay.redrawPositions(gameCtrl.pos);
  gameCtrl.gamePlay.setCursor(inp);
  const x = () => {
    expect(gamePlay.boardEl.style.cursor).toBe(inp);
  };
  setTimeout(x, 500);
});

test('Test checkBinding() toThrow', () => {
  const x = new GamePlay();
  const expected = 'GamePlay not bind to DOM';
  expect(() => { x.checkBinding(); }).toThrow(expected);
});
