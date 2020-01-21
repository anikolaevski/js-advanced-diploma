import Team from './Team';

/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  let typNumber; let
    level;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < characterCount; i++) {
    typNumber = Math.floor(Math.random() * allowedTypes.length);
    level = Math.floor(Math.random() * (maxLevel)) + 1;
    yield new allowedTypes[typNumber](level);
  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const x = characterGenerator(allowedTypes, maxLevel, characterCount);
  const myTeam = new Team();
  // eslint-disable-next-line no-plusplus
  for (let k = 0; k < characterCount; k++) {
    myTeam.add(x.next().value);
  }
  return myTeam;
}
