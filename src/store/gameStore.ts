import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { gameModes } from "../helpers/gameModes";
import { TGameModeNames, TGameModeParams } from "../types/gameModeParams";
import { TGameFieldCell } from "../types/gameFieldCell";
import { LOSE, PAUSED, PLANTED, READY, RUNNING, STARTED, WIN } from "../helpers/gameStates";
import { TFirstClickCellParams } from "../types/firstClickCellParams";

const getEmptyField = (gameMode: TGameModeParams): TGameFieldCell[][] => {
  const emptyField: TGameFieldCell[][] = []
  for (let row = 0; row < gameMode.fieldSize.y; row++) {
    emptyField.push([])
    for (let column = 0; column < gameMode.fieldSize.x; column++) {
      emptyField[row].push({
        x: column,
        y: row,
        withBomb: false,
        bombsAround: 0,
        isOpened: false,
        helpIconIndex: 0,
        wrongFlag: false
      })
    }
  }
  return emptyField
}

type TGameField = TGameFieldCell[][]
type TGameStatus = typeof PAUSED
| typeof READY
| typeof STARTED
| typeof PLANTED
| typeof RUNNING
| typeof WIN
| typeof LOSE

type TGameState = {
  gameStatus: TGameStatus,
  gameMode: TGameModeParams,
  gameField: TGameField,
  hiddenField: TGameField,
  bombsAmount: number,
  firstClick: TFirstClickCellParams,
  emptyCellsAmount: number,
  time: number,
  scoreTables: {
    [name in TGameModeNames]: Array<{name: string, time: number}>
  }
}

const initialState: TGameState = {
  gameStatus: READY,
  gameMode: gameModes[0],
  gameField: getEmptyField(gameModes[0]),
  hiddenField: getEmptyField(gameModes[0]),
  bombsAmount: gameModes[0].bombsAmount,
  firstClick: {
    hasAlreadyBeen: false,
    x: 0,
    y: 0
  },
  emptyCellsAmount: gameModes[0].fieldSize.x * gameModes[0].fieldSize.y - gameModes[0].bombsAmount,
  time: gameModes[0].time,
  scoreTables: {
    'Easy': [],
    'Medium': [],
    'Hard': []
  }
}

type TGameActions = {
  resetGame: () => void,
  setGameStatus: (newState: TGameStatus) => void,
  changeGameMode: (newState: string) => void,
  updateGameField: (newState: TGameField) => void,
  setFirstClick: (params: TFirstClickCellParams) => void,
  changeBombsAmount: (value: number) => void,
  decreaseEmptyCellsAmount: (value: number) => void,
  updateTime: (time: number) => void,
  togglePause: () => void,
  updateScoreTable: (gameMode: TGameModeNames, name: string, time: number) => void,
}

export const scoreTablesLength = 10


export const useGameStore = create<TGameState & TGameActions>()
  // eslint-disable-next-line no-unexpected-multiline
  (devtools(persist((set, get) => ({
    ...initialState,

    resetGame: () => {
      const gameMode = get().gameMode
      set({
        gameStatus: READY,
        gameField: getEmptyField(gameMode),
        hiddenField: getEmptyField(gameMode),
        bombsAmount: gameMode.bombsAmount,
        firstClick: {
          hasAlreadyBeen: false,
          x: 0,
          y: 0
        },
        emptyCellsAmount: gameMode.fieldSize.x * gameMode.fieldSize.y - gameMode.bombsAmount,
        time: gameMode.time,
      })
    },

    setGameStatus: (newState) => {
      set({
        gameStatus: newState
      })
    },

    updateGameField: (newState) => {
      set({
        gameField: structuredClone(newState),
      })
    },

    setFirstClick: (params) => {
      set({
        firstClick: { ...params }
      })
    },

    togglePause: () => {
      //меняем местами скрытое поле с видимым
      const tmp = get().hiddenField
      set({
        hiddenField: get().gameField,
        gameField: tmp,
        gameStatus: get().gameStatus !== PAUSED ? PAUSED : RUNNING 
      })
    },

    changeGameMode: (name) => {
      set({ gameMode: gameModes.find(v => v.name === name) })
      get().resetGame()
    },

    changeBombsAmount: (value) => {
      set({ bombsAmount: get().bombsAmount + value })
    },

    decreaseEmptyCellsAmount: (value) => {
      set({ emptyCellsAmount: get().emptyCellsAmount - value })
    },

    updateTime: (time) => {
      set({ time: time })
    },

    updateScoreTable: (gameMode, name, time) => {
      const tablesCopy = structuredClone(get().scoreTables)
      let tableCopy = tablesCopy[gameMode]
      tableCopy.push({name: name, time: time})
      tableCopy = tableCopy.sort((a, b) => a.time-b.time).slice(0, scoreTablesLength)
      tablesCopy[gameMode] = tableCopy
      set({
        scoreTables: tablesCopy
      })
    }
  }),
    {
      name: 'state',
      storage: createJSONStorage(() => localStorage)
    }
  )
))