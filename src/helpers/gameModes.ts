import { TGameModeParams } from "../types/gameModeParams";

export const gameModes: TGameModeParams[] = [
  {
    name: 'Easy',
    fieldSize: {
      x: 8,
      y: 8
    },
    time: 10 * 60 * 1000, //10 min
    bombsAmount: 2
  },
  {
    name: 'Medium',
    fieldSize: {
      x: 16,
      y: 16
    },
    time: 40 * 60 * 1000, //40 min
    bombsAmount: 30
  },
  {
    name: 'Hard',
    fieldSize: {
      x: 32,
      y: 16
    },
    time: 100 * 60 * 1000, //100 min
    bombsAmount: 101
  },
  // {
  //   name: 'Custom',
  //   fieldSize: {
  //     x: 20,
  //     y: 20,
  //   },
  //   time: 20 * 60,
  //   bombsAmount: 70
  // }
]