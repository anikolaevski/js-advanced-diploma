export default class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    this.startpos = 0;
    // TODO: throw error if user use "new Character()"

    // eslint-disable-next-line no-proto
    if (Object.getPrototypeOf(this).constructor.name === 'Character') {
      throw new Error("Parent class instances creation isn't permitted");
      // this.__proto__.constructor.name
    }
  }

  showStatus() {
    const signs = {
      level: 0x1F396,
      attack: 0x2694,
      defence: 0x1F6E1,
      health: 0x2764,
    };
    const result = `${String.fromCodePoint(signs.level)}${this.level}`
    + `${String.fromCodePoint(signs.attack)}${this.attack}`
    + `${String.fromCodePoint(signs.defence)}${this.defence}`
    + `${String.fromCodePoint(signs.health)}${this.health}`;
    return result;
  }

  levelup() {
    this.level += 1;
    const attack = Math.max(this.attack, this.attack * (1.8 - this.health / 100));
    const defence = Math.max(this.defence, this.defence * (1.8 - this.health / 100));
    this.health = Math.min(this.health + 80, 100);
    this.attack = attack;
    this.defence = defence;
  }
}
