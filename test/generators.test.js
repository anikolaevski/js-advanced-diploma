/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
import { characterGenerator, generateTeam } from '../src/js/generators';
import {
  Swordsman, Bowman, Magician, Undead, Vampire, Daemon,
} from '../src/js/GameClasses';

const AllowedClasses = {
  player: [Swordsman, Bowman, Magician],
  opponent: [Undead, Vampire, Daemon],
};

test('Test characterGenerator', () => {
  const characterCount = 3;
  const maxLevel = 2;
  const x = characterGenerator(AllowedClasses.player, maxLevel, characterCount);
  for (let k = 0; k < characterCount; k++) {
    const a = x.next().value;
    expect(a.health).toEqual(50);
  }
  const y = characterGenerator(AllowedClasses.opponent, maxLevel, characterCount);
  for (let k = 0; k < characterCount; k++) {
    const b = y.next().value;
    expect(b.health).toEqual(50);
  }
});

test('Test generateTeam', () => {
  const characterCount = 3;
  const maxLevel = 2;
  const myTeam = generateTeam(AllowedClasses.player, maxLevel, characterCount);
  expect(myTeam.set.length).toEqual(3);
  for (const member of myTeam.set) {
    expect(member.val.health).toEqual(50);
  }
});
