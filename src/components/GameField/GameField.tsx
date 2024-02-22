import { useEffect, useLayoutEffect, useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { FLAG, helpCellIcons } from '../../helpers/cellIcons'
import { LOSE, PAUSED, PLANTED, READY, RUNNING, STARTED, WIN } from '../../helpers/gameStates'
import NameInput from '../NameInput/NameInput'
import Cell from '../Cell/Cell'
import { TGameFieldCell } from '../../types/gameFieldCell'

const GameField = () => {

  // ------------------------- Support Functions ----------------------------

  const plantBombsAndPasteDigits = (firstClickedX: number, firstClickedY: number) => {
    const gameFieldCopy = structuredClone(gameField)

    // создаeм набор доступных ячеек и выбирать случайную из них. массив вида [[x1,y1], [x2,y1]]
    const coords: { x: number, y: number }[] = []
    gameFieldCopy.forEach(row => row.forEach(cell => {
      coords.push({ x: cell.x, y: cell.y })
    }))

    //вычитаем координату первого клика и заполняем бомбами
    coords.splice(coords.findIndex(v => v.x === firstClickedX && v.y === firstClickedY), 1)

    for (let i = 0; i < gameMode.bombsAmount; i++) {
      const randomIndex = Math.floor(Math.random() * coords.length);
      //достаем случайный элемент без бомбы
      const bombCell = gameFieldCopy[coords[randomIndex].y][coords[randomIndex].x]
      bombCell.withBomb = true
      //убираем этот элемент из массива доступных к заполнению
      coords.splice(coords.findIndex(v => v.x === bombCell.x && v.y === bombCell.y), 1)
      // проходимся по клеткам вокруг для изменения bombsAround
      for (let row = 0; row < 3; row++) {
        const currentRow = gameFieldCopy[bombCell.y - 1 + row]
        if (currentRow) {
          for (let column = 0; column < 3; column++) {
            const currentCell = currentRow[bombCell.x - 1 + column]
            if (currentCell) {
              currentCell.bombsAround += 1
            }
          }
        }
      }
    }
    return gameFieldCopy
  }

  const openCell = (x: number, y: number) => {
    let openedCellsCounter = 0
    let changedBombsAmountCounter = 0
    // Если открыли ячейку с бомбой - проиграли (lose)
    const currentCell = gameField[y][x]
    if (currentCell.withBomb) {
      setGameStatus(LOSE)
      return
    }
    
    const newField = structuredClone(gameField)
    // если нет вспомогательной иконки, то начинаем "открытие",
    // если иконка есть, то сбрасываем ее и не открываем ячейку
    if (currentCell.helpIconIndex === 0) {
      subOpenCell(x, y, newField)
      if (openedCellsCounter) decreaseEmptyCellsAmount(openedCellsCounter)
      if (changedBombsAmountCounter) changeBombsAmount(changedBombsAmountCounter)
    } else {
      if (currentCell.helpIconIndex === flagIndex) changeBombsAmount(1)
      currentCell.helpIconIndex = 0
    }
    updateGameField(newField)


    // функция, рекурсивно открывающая ячейки
    function subOpenCell(subX: number, subY: number, newField: TGameFieldCell[][]) {
      const currentCell = newField[subY][subX]

      currentCell.isOpened = true
      openedCellsCounter++

      // если ячейка была с флагом, то увеличиваем обратно число оставшихся бомб
      if (currentCell.helpIconIndex === flagIndex) {
        currentCell.helpIconIndex = 0
        changedBombsAmountCounter++
      }
      // если вокруг нет бомб и ячейка без бомбы, 
      // начинаем рекурсивное сканирование ячеек вокруг
      if (!currentCell.bombsAround) {
        for (let row = 0; row < 3; row++) {
          const nextRow = newField[subY - 1 + row]
          if (nextRow) {
            for (let column = 0; column < 3; column++) {
              const nextCell = nextRow[subX - 1 + column]
              // проверив, существуют ли поля, проверяем ячейку. 
              // если она еще не открыта и не равна "исходной" ячейке, 
              // то рекурсивно открываем ее
              if (nextCell &&
                !nextCell.isOpened &&
                // !nextCell.withBomb &&  // можно пропустить, т.к. bombsAround у ячейки с бомбой тоже есть, а это проверяется выше
                !(nextCell.x === subX && nextCell.y === subY)
              ) {
                subOpenCell(nextCell.x, nextCell.y, newField)
              }
            }
          }
        }
      }
    }
  }

  const setHelperIcon = (x: number, y: number) => {
    const newField = structuredClone(gameField)
    const currentCell = newField[y][x]

    if (currentCell.helpIconIndex === flagIndex) {
      changeBombsAmount(1)
    }

    if (currentCell.helpIconIndex === helpIconsAmount - 1) {
      currentCell.helpIconIndex = 0
    } else {
      currentCell.helpIconIndex += 1
    }

    if (currentCell.helpIconIndex === flagIndex) {
      changeBombsAmount(-1)
    }

    updateGameField(newField)
  }

  const showAllBombsAndRemoveWrongFlags = () => {
    const gameFieldCopy = structuredClone(gameField)
    for (let row = 0; row < gameMode.fieldSize.y; row++) {
      for (let column = 0; column < gameMode.fieldSize.x; column++) {
        const currentCell = gameFieldCopy[row][column]
        if (currentCell.withBomb && currentCell.helpIconIndex !== flagIndex) {
          currentCell.isOpened = true
          continue
        }
        if (currentCell.helpIconIndex === flagIndex && !currentCell.withBomb) {
          currentCell.wrongFlag = true
          continue
        }
      }
    }
    updateGameField(gameFieldCopy)
  }

  // ---------------------------Component Body ------------------------------

  const gameStatus = useGameStore(state => state.gameStatus)
  const setGameStatus = useGameStore(state => state.setGameStatus)
  const gameMode = useGameStore(state => state.gameMode)

  const time = useGameStore(state => state.time)

  const gameField = useGameStore(state => state.gameField)
  const updateGameField = useGameStore(state => state.updateGameField)
  const firstClick = useGameStore(state => state.firstClick)
  const setFirstClick = useGameStore(state => state.setFirstClick)

  const changeBombsAmount = useGameStore(state => state.changeBombsAmount)

  const emptyCellsAmount = useGameStore(state => state.emptyCellsAmount)
  const decreaseEmptyCellsAmount = useGameStore(state => state.decreaseEmptyCellsAmount)

  const resetGame = useGameStore(state => state.resetGame)

  const helpIconsAmount = Object.keys(helpCellIcons).length
  const flagIndex = Object.keys(helpCellIcons).indexOf(FLAG)

  const [showNameModal, setShowNameModal] = useState(false)

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  //если случился первый клик, то заполняем бомбами
  useLayoutEffect(() => {
    if (firstClick.hasAlreadyBeen) {
      switch (gameStatus) {
        //начинаем игру, если она начата кликом на поле
        case READY:
          setGameStatus(STARTED)
          break;
        case STARTED:
          updateGameField(plantBombsAndPasteDigits(firstClick.x, firstClick.y))
          setGameStatus(PLANTED)
          break;
        case PLANTED:
          setGameStatus(RUNNING)
          openCell(firstClick.x, firstClick.y)
          break;
        case LOSE:
          showAllBombsAndRemoveWrongFlags()
          break;
        default:
          return

      }
    } else {
      setShowNameModal(false)
    }
  }, [firstClick, gameStatus])

  //отслеживаем количество неоткрытых пустых клеток
  useLayoutEffect(() => {
    // если открыты все -> победа :) (win)
    if (emptyCellsAmount === 0) {
      setGameStatus(WIN)
    }
  }, [emptyCellsAmount])

  // сравнение и запись результата в таблицу
  useEffect(() => {
    if (gameStatus === WIN) {
      //вытаскиваем последнюю строчку в таблице
      const compareTime = useGameStore.getState().scoreTables[gameMode.name].slice(-1)[0]?.time
      if (compareTime) {
        if (gameMode.time - time < compareTime) {
          setShowNameModal(true)
        }
      } else {
        setShowNameModal(true)
      }
    }
  }, [time])

  useEffect(() => {
    if (gameStatus !== PAUSED) {
      resetGame()
    }
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    () => window.removeEventListener('resize', handleResize)
  }, [])
  //чтобы при обновлении игра сбрасывалась, если перед этим не была на паузе

  const gridCellSize = windowSize.width > 1024 ? '2rem' : '1fr'

  return (
    <>
      <div>
        <div style={{
          gridTemplateRows: `repeat(${gameMode.fieldSize.y}, ${gridCellSize})`,
          gridTemplateColumns: `repeat(${gameMode.fieldSize.x}, ${gridCellSize})`
        }}
          className='grid justify-center'>
          {gameField.map((row) => row.map((cell) => {
            return (
              <Cell
                key={cell.y * gameMode.fieldSize.y + cell.x}
                cellData={gameField[cell.y][cell.x]}
                firstClick={firstClick}
                setFirstClick={setFirstClick}
                openCell={openCell}
                setHelperIcon={setHelperIcon}
              />
            )
          }))}
        </div>
        {showNameModal &&
          <NameInput
            setShowModal={setShowNameModal}
            time={time}
            gameMode={gameMode} />
        }
      </div>
    </>
  )
}

export default GameField