import { LOSE, PAUSED, READY, RUNNING, STARTED, WIN } from '../../helpers/gameStates'
import { useGameStore } from '../../store/gameStore'
const StartStopButtons = () => {
  const gameStatus = useGameStore(state => state.gameStatus)
  const resetGame = useGameStore(state => state.resetGame)
  const setGameStatus = useGameStore(state => state.setGameStatus)
  const togglePause = useGameStore(state => state.togglePause)

  const playPauseClickHandler = () => {
    if (gameStatus === WIN || gameStatus === LOSE) {
      resetGame()
      return
    }
    if (gameStatus === RUNNING || gameStatus === STARTED || gameStatus === PAUSED) {
      togglePause()
      return
    }
    if (gameStatus === READY) {
      setGameStatus(STARTED)
    }
  }

  return (
    <div>
      <div className="h-full flex gap-4">
        <button className='block h-full w-20' onClick={playPauseClickHandler}>
          {gameStatus === PAUSED
            || gameStatus === READY
            || gameStatus === WIN
            || gameStatus === LOSE
            ? 'Play' : 'Pause'
          }
        </button>
        <button className='block h-full w-20' onClick={resetGame}>Reset</button>
      </div>
    </div>
  )
}

export default StartStopButtons