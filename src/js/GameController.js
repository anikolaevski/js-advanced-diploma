import themes from './themes';
import {
  createTeams, checkCharType, GlobalRules, upgradeTeams,
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
      this.gamePlay.cellClickListeners.push((a) => {
        this.onCellClick(a);
      });
      this.gamePlay.cellEnterListeners.push((a) => {
        this.onCellEnter(a);
      });
      this.gamePlay.cellLeaveListeners.push((a) => {
        this.onCellLeave(a);
      });
    }
    GameState.level = level;
    GameState.score = 0;
    GameState.turn = 'player';
    GameState.selected = 0;
    GameState.GameController = this;
    // console.log(GameState.turn, GameState.myTeam, GameState.oppTeam );
    console.log(GameState.GameController);
    // console.log(this);

    // TODO: load saved stated from stateService
  }

  /*
  * Finish the level
  * typ - gane side, one of 'player'/'opponent'
  */
  levelFinish(typ) {
    if (typ === 'player') {
      GameState.level += 1;
      GameState.score += 10;
      // restore units health, upgrade units level, add units to player's team,
      // generate new opponent team
      this.pos = upgradeTeams(GameState.level);
      this.gamePlay.redrawPositions(this.pos);
    } else {
      // regenerate teams within same level with default params
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
      console.log('attackunit', attackunit);
      this.doAttack(attackunit.position, attackunit.plindex);
    }
    if (moveunit) {
      console.log('moveunit', moveunit);
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
      this.gamePlay.showError('Неверно заданы параметры атаки!');
      return false;
    }
    const attacker = unit1.character;
    const target = unit2.character;
    const calcDamage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
    const self = this;
    // eslint-disable-next-line func-names
    const kill = async function (x) {
      const a = await self.gamePlay.showDamage(index2, x);
      if (target.health > calcDamage) { // make damage
        target.health -= calcDamage;
      } else { // kill
        const posIndex2 = self.pos.findIndex(p => p.position === index2);
        self.gamePlay.deselectCell(index2);
        self.pos.splice(posIndex2, 1);
        self.gamePlay.redrawPositions(self.pos);
      }
    };
    kill(calcDamage);
    // console.log('Attack unit1', unit1);
    // console.log('Attack unit2', unit2);
    // console.log('calcDamage', calcDamage);

    // calc units, finish level if all are killed
    let playerUnits = 0;
    let opponentUnits = 0;
    for (const member of this.pos) {
      if (checkCharType(member.character.type) === 'player') {
        playerUnits++;
      } else {
        opponentUnits++;
      }
    }
    console.log('playerUnits left', playerUnits);
    console.log('opponentUnits left', opponentUnits);
    console.log(this.pos);
    if (playerUnits === 0) {
      this.levelFinish('player');
    } else if (opponentUnits === 0) {
      this.levelFinish('opponent');
    }

    return true;
  }

  onCellClick(index) {
    // TODO: react to click
    const ch = this.pos.find(p => p.position === index);
    const range = calcRange(index, GameState.selected, GlobalRules.boardSize);
    if (ch) {
      // console.log('click', index, ch.character.type);
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
      console.log('move', index);
      this.moveChar(GameState.selected, index);
      this.gamePlay.deselectCell(GameState.selected);
      GameController.makeTurn();
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
