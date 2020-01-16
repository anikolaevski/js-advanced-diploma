export default class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
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
}
