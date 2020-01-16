import themes from './themes';
import { createTeams } from './GameSetup';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.pos = [];
  }

  init(themeName) {
    // TODO: add event listeners to gamePlay events
    // const selfGameController = this; //делаем замыкание
    this.gamePlay.drawUi(themes[themeName].name);
    this.pos = createTeams();
    // console.log(selfGameController, pos);
    this.gamePlay.redrawPositions(this.pos);

    this.gamePlay.cellClickListeners.push((a) => {
      this.onCellClick(a);
    });
    this.gamePlay.cellEnterListeners.push((a) => {
      this.onCellEnter(a);
    });
    this.gamePlay.cellLeaveListeners.push((a) => {
      this.onCellLeave(a);
    });

    console.log(this);

    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
    const ch = this.pos.find(p => p.position === index);
    // if (ch) {
    //   console.log('click', index, ch.character);
    // }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const ch = this.pos.find(p => p.position === index);
    if (ch) {
      this.gamePlay.showCellTooltip(ch.character.showStatus(), index);
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    const ch = this.pos.find(p => p.position === index);
    if (ch) {
      this.gamePlay.hideCellTooltip(index);
    }
  }
}
