/* eslint-disable import/prefer-default-export */
import Character from './Character';

export class Swordsman extends Character {
  constructor(level, type = 'swordsman') {
    super();
    this.level = level;
    this.attack = 40;
    this.defence = 10;
    this.range = 1;
    this.attackrange = 1;
    this.health = 50;
    this.type = type;
  }
}

export class Bowman extends Character {
  constructor(level, type = 'bowman') {
    super();
    this.level = level;
    this.attack = 25;
    this.defence = 25;
    this.range = 2;
    this.attackrange = 2;
    this.health = 50;
    this.type = type;
  }
}

export class Magician extends Character {
  constructor(level, type = 'magician') {
    super();
    this.level = level;
    this.attack = 10;
    this.defence = 40;
    this.range = 1;
    this.attackrange = 4;
    this.health = 50;
    this.type = type;
  }
}

export class Undead extends Character {
  constructor(level, type = 'undead') {
    super();
    this.level = level;
    this.attack = 25;
    this.defence = 25;
    this.range = 1;
    this.attackrange = 1;
    this.health = 50;
    this.type = type;
  }
}

export class Vampire extends Character {
  constructor(level, type = 'vampire') {
    super();
    this.level = level;
    this.attack = 40;
    this.defence = 10;
    this.range = 2;
    this.attackrange = 2;
    this.health = 50;
    this.type = type;
  }
}

export class Daemon extends Character {
  constructor(level, type = 'daemon') {
    super();
    this.level = level;
    this.attack = 10;
    this.defence = 40;
    this.range = 1;
    this.attackrange = 4;
    this.health = 50;
    this.type = type;
  }
}
