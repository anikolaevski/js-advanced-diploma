import GamePlay from '../src/js/GamePlay';
import GameController from '../src/js/GameController';
import {
  GlobalRules, // createTeams, //checkCharType, upgradeTeams, reCreatePositions,
} from '../src/js/GameSetup';
import GameState from '../src/js/GameState';
import GameStateService from '../src/js/GameStateService';

document.body.innerHTML = '<div id="game-container"></div>';
const gamePlay = new GamePlay();
gamePlay.bindToDOM(document.querySelector('#game-container'));
const stateService = new GameStateService(sessionStorage);
const gameCtrl = new GameController(gamePlay, stateService);

test('Test init', () => {
  const level = 1;
  gameCtrl.init(level);
  expect(gameCtrl.pos.length).toBe(4);
  expect(GameState.turn).toBe('player');
});

test('Test moveChar', () => {
  const level = 1;
  gameCtrl.init(level);
  for (const item of gameCtrl.pos) {
    const index1 = item.position;
    const x1 = index1 % GlobalRules.boardSize;
    const y1 = (index1 - x1) / GlobalRules.boardSize;
    let x2;
    if (x1 <= 1) {
      x2 = x1 + 1;
    } else if (x1 >= GlobalRules.boardSize - 2) {
      x2 = x1 - 1;
    }
    const index2 = (y1 * GlobalRules.boardSize) + x2;
    const toDo = gameCtrl.pos.findIndex(o => o.position === index2);
    if (toDo === -1) {
      gameCtrl.moveChar(index1, index2);
      expect(item.position).toBe(index2);
    }
  }
});

test('Test makeTurn', () => {
  const level = 1;
  gameCtrl.init(level);
  GameController.makeTurn();
  expect(GameState.turn).toBe('opponent');
});

test('Test doOpponentTurn', () => {
  const level = 1;
  gameCtrl.init(level);
  GameController.makeTurn();
  function x() {
    expect(GameState.turn).toBe('player');
  }
  setTimeout(() => x, 2000);
});

test('Test doAttack wrong attack params', () => {
  const jsdomAlert = window.alert; // remember the jsdom alert
  window.alert = () => {}; // provide an empty implementation for window.alert
  const level = 1;
  gameCtrl.init(level);
  const ret = gameCtrl.doAttack(27, 28);
  expect(ret).toBe(false);
  window.alert = jsdomAlert;
});

test('Test doAttack', () => {
  const level = 1;
  gameCtrl.init(level);
  const ch1 = gameCtrl.pos.find(o => o.position % GlobalRules.boardSize <= 1);
  const ch2 = gameCtrl.pos.find(
    o => o.position % GlobalRules.boardSize >= GlobalRules.boardSize - 2,
  );
  // const h2 = ch2.character.health;
  ch1.position = 27;
  ch2.position = 28;
  if (GameState.turn === 'opponent') {
    GameController.makeTurn();
  }
  const ret = gameCtrl.doAttack(ch1.position, ch2.position);
  expect(ret).toBe(true);
  // expect(ch2.character.health).toBeLessThan(h2);
});

test('Test onCellClick on empty field', () => {
  const index = 27;
  const expected = `Ячейка ${index} не содержит персонажа!`;
  let str;
  const jsdomAlert = window.alert; // remember the jsdom alert
  window.alert = (a) => { str = a; }; // provide an empty implementation for window.alert
  const level = 1;
  gameCtrl.init(level);
  gameCtrl.onCellClick(27);
  expect(expected).toBe(str);
  window.alert = jsdomAlert;
});

test('Test onCellClick select all Player"s chars', () => {
  const level = 1;
  gameCtrl.init(level);
  gameCtrl.pos.forEach((o) => {
    if (o.position % GlobalRules.boardSize <= 1) {
      const index = o.position;
      gameCtrl.onCellClick(index);
      expect(GameState.selected).toBe(index);
    }
  });
});

test('Test onCellClick on opponent unit', () => {
  const expected = 'Можно выделить только своего персонажа!';
  let str;
  const jsdomAlert = window.alert; // remember the jsdom alert
  window.alert = (a) => { str = a; }; // provide an empty implementation for window.alert
  const level = 1;
  gameCtrl.init(level);
  const ch2 = gameCtrl.pos.find(
    o => o.position % GlobalRules.boardSize >= GlobalRules.boardSize - 2,
  );
  const index = ch2.position;
  GameState.turn = 'player';
  gameCtrl.onCellClick(index);
  expect(str).toBe(expected);
  window.alert = jsdomAlert;
});

test('Test onCellEnter / not empty', () => {
  const level = 1;
  gameCtrl.init(level);
  const ch2 = gameCtrl.pos.find(
    o => o.position % GlobalRules.boardSize >= GlobalRules.boardSize - 2,
  );
  const index = ch2.position;
  gameCtrl.onCellEnter(index);
  const AllCells = document.querySelector('[data-id=board]').childNodes;
  const myCell = AllCells[index];
  const str = myCell.title;
  const expected = ch2.character.showStatus();
  expect(str).toBe(expected);
});

test('Test onCellEnter point Player"s chars, check cursor style', () => {
  const level = 1;
  gameCtrl.init(level);
  gameCtrl.pos.forEach((o) => {
    if (o.position % GlobalRules.boardSize <= 1) {
      const index = o.position;
      gameCtrl.onCellEnter(index);
      const str = gamePlay.boardEl.style.cursor;
      const expected = 'pointer';
      expect(str).toBe(expected);
    }
  });
});

test('Test onCellEnter select Player"s charts / point free cell, check cursor style: crosshair', () => {
  const level = 1;
  let index = 0;
  gameCtrl.init(level);
  gameCtrl.pos.forEach((o) => {
    if (o.position % GlobalRules.boardSize <= 1) {
      index = Math.max(index, o.position);
    }
  });
  gameCtrl.onCellClick(index);
  gameCtrl.onCellEnter(index);
  expect(gamePlay.boardEl.style.cursor).toBe('crosshair');
});

test('Test onCellEnter select Player"s charts / point free cell, check cursor style: pointer', () => {
  const level = 1;
  let index = 0;
  gameCtrl.init(level);
  gameCtrl.pos.forEach((o) => {
    if (o.position % GlobalRules.boardSize <= 1) {
      index = Math.max(index, o.position);
    }
  });
  gameCtrl.onCellClick(index);
  const x = () => {
    expect(gamePlay.boardEl.style.cursor).toBe('pointer');
  };
  gameCtrl.onCellEnter(index + 1);
  setTimeout(x, 1000);
});

test('Test onCellEnter / empty', () => {
  const level = 1;
  gameCtrl.init(level);
  const ch2 = gameCtrl.pos.find(
    o => o.position % GlobalRules.boardSize >= GlobalRules.boardSize - 2,
  );
  const index = ch2.position - 1;
  gameCtrl.onCellEnter(index);
  const str = gamePlay.boardEl.style.cursor;
  const expected = 'not-allowed';
  expect(str).toBe(expected);
});

test('Test onCellLeave', () => {
  const level = 1;
  gameCtrl.init(level);
  const ch2 = gameCtrl.pos.find(
    o => o.position % GlobalRules.boardSize >= GlobalRules.boardSize - 2,
  );
  const index = ch2.position;
  gameCtrl.onCellLeave(index);
  const AllCells = document.querySelector('[data-id=board]').childNodes;
  const myCell = AllCells[index];
  const str = myCell.title;
  const expected = '';
  expect(str).toBe(expected);
});

test('Test levelFinish', () => {
  const level = 1;
  gameCtrl.init(level);
  gameCtrl.levelFinish('player');
  expect(GameState.score).toBe(10);
  expect(GameState.level).toBe(level + 1);
  expect(GameState.turn).toBe('player');
});
