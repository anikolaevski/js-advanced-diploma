import {
  calcPosition, GlobalRules, AllowedClasses, createPositions, initRules, createTeams,
  upgradeTeams, checkCharType, reCreatePositions,
} from '../src/js/GameSetup';
import { generateTeam } from '../src/js/generators';
import GameState from '../src/js/GameState';

const allTypes = ['player', 'opponent'];

test('Test calcPosition', () => {
  for (const teamType of allTypes) {
    const res1 = calcPosition(teamType) % GlobalRules.boardSize;
    const res2 = [0, 1, 6, 7].includes(res1);
    expect(res2).toBe(true);
  }
});

test('Test createPositions', () => {
  const myTeam = generateTeam(AllowedClasses.player, initRules.maxlevel, initRules.players);
  const myPosCharacters = [];
  createPositions(myTeam, myPosCharacters, 'player');
  expect(myPosCharacters.length).toEqual(2);
  for (const item of myPosCharacters) {
    expect(item.character.health).toEqual(50);
  }
});

test('Test createTeams', () => {
  const pos = createTeams();
  for (const item of pos) {
    expect(item.character.health).toEqual(50);
  }
});

test('Test upgradeTeams', () => {
  GameState.myTeam = generateTeam(AllowedClasses.player, initRules.maxlevel, initRules.players);
  GameState.oppTeam = generateTeam(AllowedClasses.opponent, initRules.maxlevel, initRules.players);
  const pos = upgradeTeams(2);
  for (const item of pos) {
    expect(item.character.health).toBeGreaterThanOrEqual(50);
  }
});

test('Test checkCharType', () => {
  expect(checkCharType('swordsman')).toBe('player');
  expect(checkCharType('undead')).toBe('opponent');
  expect(checkCharType('zzz')).toBe(undefined);
});

test('Test reCreatePositions', () => {
  GameState.myTeam = generateTeam(AllowedClasses.player, initRules.maxlevel, initRules.players);
  GameState.oppTeam = generateTeam(AllowedClasses.opponent, initRules.maxlevel, initRules.players);
  const pos = reCreatePositions(GameState.myTeam, GameState.oppTeam);
  for (const item of pos) {
    expect(item.character.health).toBeGreaterThanOrEqual(50);
  }
});
