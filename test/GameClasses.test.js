import {
  Swordsman, Bowman, Magician, Undead, Vampire, Daemon,
} from '../src/js/GameClasses';

test('Test Swordsman', () => {
  const result = new Swordsman(1);
  const expected = {
    level: 1,
    attack: 40,
    defence: 10,
    range: 1,
    attackrange: 1,
    health: 50,
    startpos: 0,
    type: 'swordsman',
  };
  expect(result).toEqual(expected);
  expect(result.showStatus()).toEqual('🎖1⚔40🛡10❤50');

  const result2 = new Swordsman(1);
  result2.levelup();
  const expectedUp = {
    level: 2,
    attack: 52,
    defence: 13,
    range: 1,
    attackrange: 1,
    health: 100,
    startpos: 0,
    type: 'swordsman',
  };
  expect(result2).toEqual(expectedUp);
});

test('Test Bowman', () => {
  const result = new Bowman(1);
  const expected = {
    level: 1,
    attack: 25,
    defence: 25,
    range: 2,
    attackrange: 2,
    health: 50,
    startpos: 0,
    type: 'bowman',
  };
  expect(result).toEqual(expected);
  expect(result.showStatus()).toEqual('🎖1⚔25🛡25❤50');

  const result2 = new Bowman(1);
  result2.levelup();
  const expectedUp = {
    level: 2,
    attack: 32.5,
    defence: 32.5,
    range: 2,
    attackrange: 2,
    health: 100,
    startpos: 0,
    type: 'bowman',
  };
  expect(result2).toEqual(expectedUp);
});

test('Test Magician', () => {
  const result = new Magician(1);
  const expected = {
    level: 1,
    attack: 10,
    defence: 40,
    range: 1,
    attackrange: 4,
    health: 50,
    startpos: 0,
    type: 'magician',
  };
  expect(result).toEqual(expected);
  expect(result.showStatus()).toEqual('🎖1⚔10🛡40❤50');

  const result2 = new Magician(1);
  result2.levelup();
  const expectedUp = {
    level: 2,
    attack: 13,
    defence: 52,
    range: 1,
    attackrange: 4,
    health: 100,
    startpos: 0,
    type: 'magician',
  };
  expect(result2).toEqual(expectedUp);
});

test('Test Undead', () => {
  const result = new Undead(1);
  const expected = {
    level: 1,
    attack: 25,
    defence: 25,
    range: 1,
    attackrange: 1,
    health: 50,
    startpos: 0,
    type: 'undead',
  };
  expect(result).toEqual(expected);
  expect(result.showStatus()).toEqual('🎖1⚔25🛡25❤50');

  const result2 = new Undead(1);
  result2.levelup();
  const expectedUp = {
    level: 2,
    attack: 32.5,
    defence: 32.5,
    range: 1,
    attackrange: 1,
    health: 100,
    startpos: 0,
    type: 'undead',
  };
  expect(result2).toEqual(expectedUp);
});

test('Test Vampire', () => {
  const result = new Vampire(1);
  const expected = {
    level: 1,
    attack: 40,
    defence: 10,
    range: 2,
    attackrange: 2,
    health: 50,
    startpos: 0,
    type: 'vampire',
  };
  expect(result).toEqual(expected);
  expect(result.showStatus()).toEqual('🎖1⚔40🛡10❤50');

  const result2 = new Vampire(1);
  result2.levelup();
  const expectedUp = {
    level: 2,
    attack: 52,
    defence: 13,
    range: 2,
    attackrange: 2,
    health: 100,
    startpos: 0,
    type: 'vampire',
  };
  expect(result2).toEqual(expectedUp);
});

test('Test Daemon', () => {
  const result = new Daemon(1);
  const expected = {
    level: 1,
    attack: 10,
    defence: 40,
    range: 1,
    attackrange: 4,
    health: 50,
    startpos: 0,
    type: 'daemon',
  };
  expect(result).toEqual(expected);
  expect(result.showStatus()).toEqual('🎖1⚔10🛡40❤50');

  const result2 = new Daemon(1);
  result2.levelup();
  const expectedUp = {
    level: 2,
    attack: 13,
    defence: 52,
    range: 1,
    attackrange: 4,
    health: 100,
    startpos: 0,
    type: 'daemon',
  };
  expect(result2).toEqual(expectedUp);
});
