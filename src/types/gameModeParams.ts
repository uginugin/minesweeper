export type TGameModeNames = 'Easy' | 'Medium' | 'Hard'

export type TGameModeParams = {
  name: TGameModeNames,
  fieldSize: {
    x: number,
    y: number
  },
  bombsAmount: number,
  time: number
}