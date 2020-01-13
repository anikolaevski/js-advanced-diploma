import themes from './themes';
import { createTeams } from './GameSetup';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init(themeName) {
    // TODO: add event listeners to gamePlay events
    this.gamePlay.drawUi(themes[themeName].name);
    const pos = createTeams();
    // console.log(pos);
    this.gamePlay.redrawPositions(pos);
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
