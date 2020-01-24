/* eslint-disable import/prefer-default-export */
import {
  Swordsman, Bowman, Magician, Undead, Vampire, Daemon,
} from './GameClasses';
import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';
import GameState from './GameState';
import Team from './Team';


export const AllowedClasses = {
  player: [Swordsman, Bowman, Magician],
  opponent: [Undead, Vampire, Daemon],
};

const AllowedTypes = {
  player: ['swordsman', 'bowman', 'magician'],
  opponent: ['undead', 'vampire', 'daemon'],
};

export const GlobalRules = {
  boardSize: 8,
  respTimeout: 1000,
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

const levelRules = {
  1: {
    players: 2, playerLevel: 1, extraplayers: 0, extralevels: 0,
  },
  2: {
    players: 2, playerLevel: 1, extraplayers: 1, extralevels: 1,
  },
  3: {
    players: 2, playerLevel: 1, extraplayers: 2, extralevels: 2,
  },
  4: {
    players: 2, playerLevel: 1, extraplayers: 2, extralevels: 3,
  },
};

export const initRules = {
  level: 1,
  players: 2,
  maxlevel: 1,
};

export function calcPosition(teamType) {
  const xlimits = AllowedPos[teamType].x;
  const ylimits = AllowedPos[teamType].y;
  const x = Math.floor(Math.random() * (xlimits[1] - xlimits[0] + 1)) + xlimits[0];
  const y = Math.floor(Math.random() * (ylimits[1] - ylimits[0] + 1)) + ylimits[0];
  return y * GlobalRules.boardSize + x;
}

export function createPositions(team, myPosCharacters, teamType) {
  const setpos = new Set();
  for (const member of team.set) {
    let pos = calcPosition(teamType);
    if (setpos.size === 0) {
      setpos.add(pos);
    } else {
      while (setpos.has(pos)) {
        // console.log(`pos=${pos} is not free`);
        pos = calcPosition(teamType);
      }
    }
    member.val.startpos = pos;
    setpos.add(pos);
    myPosCharacters.push(new PositionedCharacter(member.val, pos));
  }
}

export function createTeams() {
  const myPosCharacters = [];
  const myTeam = generateTeam(AllowedClasses.player, initRules.maxlevel, initRules.players);
  const oppTeam = generateTeam(AllowedClasses.opponent, initRules.maxlevel, initRules.players);
  createPositions(myTeam, myPosCharacters, 'player');
  createPositions(oppTeam, myPosCharacters, 'opponent');
  GameState.myTeam = myTeam;
  GameState.oppTeam = oppTeam;
  return myPosCharacters;
}

export function upgradeTeams(level) {
  const myPosCharacters = [];
  // level rules
  const rul = levelRules[level];
  // Player's team levelup()
  for (const member of GameState.myTeam.set) {
    member.val.levelup();
  }
  // Player's team: add extra units
  const addteam = generateTeam(AllowedClasses.player, rul.extralevels, rul.extraplayers);
  addteam.set.forEach(o => GameState.myTeam.set.push(o));

  // Opponent team: destroy and re-create
  const oppTeam = generateTeam(AllowedClasses.opponent, rul.extralevels,
    GameState.myTeam.set.length);
  GameState.oppTeam = oppTeam;
  // console.log('GameState.myTeam', GameState.myTeam);
  // console.log('GameState.oppTeam', GameState.oppTeam);

  createPositions(GameState.myTeam, myPosCharacters, 'player');
  createPositions(GameState.oppTeam, myPosCharacters, 'opponent');
  return myPosCharacters;
}

export function checkCharType(typ) {
  const t = typ.toString().toUpperCase();
  if (AllowedTypes.player.find(o => o.toString().toUpperCase() === t)) { return 'player'; }
  if (AllowedTypes.opponent.find(o => o.toString().toUpperCase() === t)) { return 'opponent'; }
  return undefined;
}

export function reCreatePositions(myTeamParams, oppTeamParams) {
  const myPosCharacters = [];
  // eslint-disable-next-line func-names
  const x = function (typ, arrParams) {
    const team = new Team();
    for (const param of arrParams.set) {
      const i = AllowedTypes[typ].findIndex(o => o === param.val.type);
      const char = new AllowedClasses[typ][i](param.val.level);
      char.attack = param.val.attack;
      char.defence = param.val.defence;
      char.health = param.val.health;
      char.startpos = param.val.startpos;
      team.add(char);
    }
    return team;
  };
  const myTeam = x('player', myTeamParams);
  const oppTeam = x('opponent', oppTeamParams);
  GameState.myTeam = myTeam;
  GameState.oppTeam = oppTeam;
  // eslint-disable-next-line func-names
  const y = function (team) {
    const setpos = new Set();
    for (const member of team.set) {
      const pos = member.val.startpos;
      setpos.add(pos);
      myPosCharacters.push(new PositionedCharacter(member.val, pos));
    }
  };
  y(myTeam);
  y(oppTeam);
  return myPosCharacters;
}
