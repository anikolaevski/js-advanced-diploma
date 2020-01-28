/* eslint-disable func-names */
/* eslint-disable no-plusplus */
import themes from './themes';
import {
  createTeams, checkCharType, GlobalRules, upgradeTeams, reCreatePositions,
} from './GameSetup';
import GamePlay from './GamePlay';
import GameState from './GameState';
import cursors from './cursors';
import { calcRange, calcNextMoveStep } from './utils';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.pos = [];
  }

  init(level) {
    // TODO: add event listeners to gamePlay events
    const theme = themes.find(o => o.level === level);
    this.gamePlay.drawUi(theme.name);
    this.pos = createTeams(theme.level);
    this.gamePlay.redrawPositions(this.pos);

    if (this.gamePlay.cellClickListeners.length === 0) {
      const xClick = function (a) { this.onCellClick(a); }.bind(this);
      const xEnter = function (a) { this.onCellEnter(a); }.bind(this);
      const xLeave = function (a) { this.onCellLeave(a); }.bind(this);
      const xNew = function () { this.init(1); }.bind(this);
      const xSave = function () { this.saveGame(); }.bind(this);
      const xLoad = function () { this.loadGame(); }.bind(this);
      this.gamePlay.cellClickListeners.push(xClick);
      this.gamePlay.cellEnterListeners.push(xEnter);
      this.gamePlay.cellLeaveListeners.push(xLeave);
      this.gamePlay.addNewGameListener(xNew);
      this.gamePlay.addSaveGameListener(xSave);
      this.gamePlay.addLoadGameListener(xLoad);
    }
    GameState.level = level;
    GameState.score = 0;
    GameState.turn = 'player';
    GameState.selected = 0;
    GameState.lock = 0;
    if (typeof (GameState.MaxScore) === 'undefined') { GameState.MaxScore = 0; }
    GameState.GameController = this;
    // TODO: load saved stated from stateService
  }

  /*
  * Save current game
  */
  saveGame() {
    const gs = {
      level: GameState.level,
      score: GameState.score,
      turn: GameState.turn,
      selected: GameState.selected,
      MaxScore: GameState.MaxScore,
      selectedChar: GameState.selectedChar,
      myTeam: GameState.myTeam,
      oppTeam: GameState.oppTeam,
      pos: this.pos,
    };
    this.stateService.save(gs);
    GamePlay.showMessage('Игра сохранена!');
  }

  /*
  * Load saved game
  */

  loadGame() {
    // GamePlay.showMessage('Загрузка игры в разработке');
    const x = async () => {
      const gs = this.stateService.load();
      // console.log(gs);
      GameState.level = gs.level;
      GameState.score = gs.score;
      GameState.turn = gs.turn;
      GameState.selected = gs.selected;
      GameState.MaxScore = gs.MaxScore;
      GameState.selectedChar = gs.selectedChar;
      // GameState.myTeam = gs.myTeam;
      // GameState.oppTeam = gs.oppTeam;
      const theme = themes.find(o => o.level === GameState.level);
      this.gamePlay.drawUi(theme.name);
      this.pos = reCreatePositions(gs.myTeam, gs.oppTeam);
      // console.log(this.pos);
      this.gamePlay.redrawPositions(this.pos);
      if (GameState.selected > 0) {
        this.gamePlay.selectCell(GameState.selected);
      }
      GameState.lock = 0;
    };
    x();
  }

  /*
  * Finish the level
  * typ - gane side, one of 'player'/'opponent'
  */
  // eslint-disable-next-line consistent-return
  levelFinish(typ) {
    // eslint-disable-next-line no-console
    console.log('levelFinish started');
    if (typ === 'player') {
      GameState.score += 10;
      GameState.MaxScore = Math.max(GameState.score, GameState.MaxScore) + 10;
      if (GameState.level >= 4) {
        GamePlay.showMessage(`Поздравляю! Вы выиграли!!! Ваш счет ${GameState.MaxScore} очков.`);
        // this.init(1);
        GameState.lock = 1;
        GameState.selected = 0;
        return 0;
      }
      GameState.level += 1;
      const theme = themes.find(o => o.level === GameState.level);
      this.gamePlay.drawUi(theme.name);
      // restore units health, upgrade units level, add units to player's team,
      // generate new opponent team
      this.pos.splice(0, this.pos.length);
      this.pos = upgradeTeams(GameState.level);
      this.gamePlay.redrawPositions(this.pos);
      // eslint-disable-next-line no-console
      console.log('level:', theme.level, 'theme:', theme.name);
    } else {
      // regenerate teams within same level with default params
      // eslint-disable-next-line no-console
      console.log('restarting same level', GameState.level);
      this.init(GameState.level);
    }
    GameState.selected = 0;
  }

  /*
  * Move character into new position
  * index - current character pos
  * index1 - new character pos
  */
  moveChar(index, newIndex) {
    const ch1 = this.pos.find(p => p.position === index);
    const ch2 = this.pos.find(p => p.position === newIndex);
    if (ch1 && !ch2) {
      if (calcRange(index, newIndex, GlobalRules.boardSize) <= ch1.character.range) {
        ch1.position = newIndex;
        this.gamePlay.redrawPositions(this.pos);
      }
    }
  }

  /*
  * Switch game turn
  */
  static makeTurn() {
    if (GameState.turn === 'player') {
      GameState.turn = 'opponent';
      GameState.GameController.opponentTurn();
    } else if (GameState.turn === 'opponent') {
      GameState.turn = 'player';
    }
  }

  /*
  * Planning Opponent's turn
  */
  opponentTurn() {
    setTimeout(() => this.doOpponentTurn(), GlobalRules.respTimeout);
  }

  /*
  * Opponent's turn actions
  */
  doOpponentTurn() {
    // get all opp's units, calc ranges to closest player's char
    const opp = []; // opp's units
    const pl = []; // player's units
    for (const member of this.pos) {
      if (checkCharType(member.character.type) === 'player') {
        pl.push(member);
      } else {
        opp.push(member);
      }
    }
    // Calculate units move/attack
    let range;
    let plindex;
    for (const member of opp) {
      range = GlobalRules.boardSize;
      // eslint-disable-next-line no-loop-func
      pl.forEach((p) => { // calc min range to player's units
        range = Math.min(range, calcRange(member.position, p.position, GlobalRules.boardSize));
      });
      member.range = range;
      plindex = -1;
      // eslint-disable-next-line no-loop-func
      pl.forEach((p) => { // calc closest player's units
        range = calcRange(member.position, p.position, GlobalRules.boardSize);
        if (range === member.range) {
          plindex = p.position;
        }
        member.plindex = plindex;
        member.nextindex = calcNextMoveStep(member.position, plindex,
          member.character.range, member.character.attackrange, GlobalRules.boardSize);
        member.toattack = (member.character.attackrange >= member.range); // do attack?
      });
    }

    // move farest char in direction to closest player's char or attack
    let attackunit;
    let moveunit;
    for (const member of opp) {
      if (member.toattack) {
        attackunit = member;
      } else {
        moveunit = member;
      }
    }
    if (attackunit) {
      // console.log('attackunit', attackunit);
      this.doAttack(attackunit.position, attackunit.plindex);
    }
    if (moveunit) {
      // console.log('moveunit', moveunit);
      this.moveChar(moveunit.position, moveunit.nextindex);
    }
    GameController.makeTurn();
  }

  /*
  * Perform attack
  * index1 - index of attacker
  * index2 - index of target
  */
  doAttack(index1, index2) {
    const unit1 = this.pos.find(p => p.position === index1);
    const unit2 = this.pos.find(p => p.position === index2);
    if (!unit1 || !unit2) {
      GamePlay.showError('Неверно заданы параметры атаки!');
      return false;
    }
    const attacker = unit1.character;
    const target = unit2.character;
    const calcDamage = Math.round(100 * Math.max(attacker.attack
      - target.defence, attacker.attack * 0.1)) / 100;
    const self = this;
    // eslint-disable-next-line func-names
    const kill = async function (x) {
      await self.gamePlay.showDamage(index2, x);
      if (target.health > calcDamage) { // make damage
        target.health -= calcDamage;
        target.health = Math.round(target.health * 10) / 10;
      } else { // kill
        const posIndex2 = self.pos.findIndex(p => p.position === index2);
        self.gamePlay.deselectCell(index2);
        self.pos.splice(posIndex2, 1);
      }
      self.gamePlay.redrawPositions(self.pos);
      // calc units, finish level if all are killed
      let playerUnits = 0;
      let opponentUnits = 0;
      for (const member of self.pos) {
        if (checkCharType(member.character.type) === 'player') {
          playerUnits++;
        } else {
          opponentUnits++;
        }
      }
      if (playerUnits === 0) {
        self.levelFinish('opponent');
      } else if (opponentUnits === 0) {
        self.levelFinish('player');
      }
    };
    kill(calcDamage);
    return true;
  }

  // eslint-disable-next-line consistent-return
  onCellClick(index) {
    // TODO: react to click
    if (GameState.lock > 0) { return 0; }
    const ch = this.pos.find(p => p.position === index);
    const range = calcRange(index, GameState.selected, GlobalRules.boardSize);
    // console.log('click', index);
    if (ch) {
      if (GameState.turn === 'player') {
        const ch1 = checkCharType(ch.character.type);
        if (ch1 === 'player') {
          if (GameState.selected !== 0 && GameState.selected !== index) {
            this.gamePlay.deselectCell(GameState.selected);
          }
          this.gamePlay.selectCell(index);
          GameState.selected = index;
          GameState.selectedChar = ch.character;
        } else if (typeof (GameState.selectedChar) !== 'undefined' && range <= GameState.selectedChar.attackrange) {
          this.doAttack(GameState.selected, index);
          GameController.makeTurn();
        } else {
          GamePlay.showError('Можно выделить только своего персонажа!');
        }
      }
    } else if (typeof (GameState.selectedChar) !== 'undefined' && range <= GameState.selectedChar.range) { // move
      // console.log('move', index);
      this.moveChar(GameState.selected, index);
      this.gamePlay.deselectCell(GameState.selected);
      GameController.makeTurn();
      this.gamePlay.selectCell(index);
      GameState.selected = index;
    } else {
      GamePlay.showError(`Ячейка ${index} не содержит персонажа!`);
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const ch = this.pos.find(p => p.position === index);
    let range;

    if (ch) { // there is a char in entered cell
      if (GameState.turn === 'player') { // this is Player turn
        const ch1 = checkCharType(ch.character.type);
        if (ch1 === 'player' && GameState.selected !== index) {
          this.gamePlay.setCursor(cursors.pointer);
        } else {
          range = calcRange(index, GameState.selected, GlobalRules.boardSize);
          // console.log(range);
          if (typeof (GameState.selectedChar) !== 'undefined') {
            if (range <= GameState.selectedChar.attackrange) {
              this.gamePlay.setCursor(cursors.crosshair);
            } else {
              this.gamePlay.setCursor(cursors.notallowed);
            }
          } else {
            this.gamePlay.setCursor(cursors.notallowed);
          }
        }
      }
      this.gamePlay.showCellTooltip(ch.character.showStatus(), index);
    } else {
      // calc range to selected
      range = calcRange(index, GameState.selected, GlobalRules.boardSize);
      // compare to GameState.selectedChar.range for move
      if (typeof (GameState.selectedChar) !== 'undefined' && range <= GameState.selectedChar.range) {
        this.gamePlay.setCursor(cursors.pointer);
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    const ch = this.pos.find(p => p.position === index);
    if (ch) {
      this.gamePlay.hideCellTooltip(index);
    }
    this.gamePlay.setCursor(cursors.auto);
  }
}
