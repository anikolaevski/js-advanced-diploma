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
};

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

function calcPosition(teamType) {
  const xlimits = AllowedPos[teamType].x;
  const ylimits = AllowedPos[teamType].y;
  const x = Math.floor(Math.random() * (xlimits[1] - xlimits[0] + 1)) + xlimits[0];
  const y = Math.floor(Math.random() * (ylimits[1] - ylimits[0] + 1)) + ylimits[0];
  return y * GlobalRules.boardSize + x;
}

function createPositions(team, myPosCharacters, teamType) {
  const setpos = new Set();
  for (const member of team.set) {
    let pos = calcPosition(teamType);
    if (setpos.size === 0) {
      setpos.add(pos);
    } else {
      while (setpos.has(pos)) {
        console.log(`pos=${pos} is not free`);
        pos = calcPosition(teamType);
      }
    }
    setpos.add(pos);
    console.log(pos, member.val.showStatus(), member.val);
    myPosCharacters.push(new PositionedCharacter(member.val, pos));
    // }
  }
}

export function createTeams() {
  const myPosCharacters = [];
  const myTeam = generateTeam(AllowedClasses.player, initRules.maxlevel, initRules.players);
  const oppTeam = generateTeam(AllowedClasses.opponent, initRules.maxlevel, initRules.players);
  // console.log('myTeam', myTeam);
  // console.log('oppTeam', oppTeam);
  createPositions(myTeam, myPosCharacters, 'player');
  createPositions(oppTeam, myPosCharacters, 'opponent');
  // // console.log('positions', myPosCharacters);
  return myPosCharacters;
}
