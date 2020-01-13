export default class Team {
  constructor() {
    this.set = [];
    this.counter = 0;
  }

  add(member) {
    this.set.push({
      // eslint-disable-next-line no-plusplus
      id: this.counter++,
      val: member,
    });
  }
}
