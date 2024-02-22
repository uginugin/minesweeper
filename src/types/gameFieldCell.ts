export type TGameFieldCell = {
  x: number,
  y: number,
  withBomb: boolean,
  bombsAround: number,
  isOpened: boolean,
  helpIconIndex: number,
  wrongFlag: boolean,
}