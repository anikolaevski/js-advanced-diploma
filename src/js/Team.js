export default class Team {
  constructor(typ) {
    this.typ = typ;
    this.set = [];
  }

  add(member) {
    this.set.push(member);
  }
}
