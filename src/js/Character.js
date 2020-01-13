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
}
