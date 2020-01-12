/* eslint-disable import/prefer-default-export */
import {
  Swordsman, Bowman, Magician, Undead, Vampire, Daemon,
} from './GameClasses';

import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';

const AllowedClasses = {
  player: [Swordsman, Bowman, Magician],
  opponent: [Undead, Vampire, Daemon],
};

export const GlobalRules = {
  boardSize: 8,
}

const AllowedPos = {
  player: {
    x: [0, 1],
    y: [0, 7],
  },
  opponent: {
    x: [6, 7],
    y: [0, 7],
  },
};

// const levels = {
//   1: {players: 2, playerLevel: 1, extraplayers:0, extralevels: 0},
//   2: {players: 2, playerLevel: 1, extraplayers:0, extralevels: 0},
//   3: {players: 2, playerLevel: 1, extraplayers:0, extralevels: 0},
//   4: {players: 2, playerLevel: 1, extraplayers:0, extralevels: 0},
// }

const initRules = {
  level: 1,
  players: 2,
  maxlevel: 1,
};

// const nextLevelRules = {
//   extra
// }

export function createTeams() {
  const myTeam = generateTeam(AllowedClasses.player, initRules.maxlevel, initRules.players);
  // const oppTeam = generateTeam(AllowedClasses.opponent, initRules.maxlevel, initRules.players);
  console.log('myTeam', myTeam);
  // console.log('oppTeam', oppTeam);
  const pos1 = createPositions(myTeam, 'player');
  console.log('positions', pos1);

}

function createPositions(team, teamType) {
  const myPosCharacters = [];
  const xlimits = AllowedPos[teamType].x;
  const ylimits = AllowedPos[teamType].y;
  // console.log(xlimits, ylimits);
  for ( const member of team.set) {
    let x = Math.floor(Math.random() * (xlimits[1] - xlimits[0] + 1)) + xlimits[0];
    let y = Math.floor(Math.random() * (ylimits[1] - ylimits[0] + 1)) + ylimits[0];
    // console.log(x, y);
    let position = (y + 1) * GlobalRules.boardSize + x + 1;
    myPosCharacters.push(new PositionedCharacter(member, position));
  }
  return myPosCharacters;

}