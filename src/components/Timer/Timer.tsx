import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useGameStore } from '../../store/gameStore';
import { LOSE, READY, RUNNING, STARTED } from '../../helpers/gameStates';
import { zeroPad } from '../../helpers/timeFormatting';

const Timer = () => {
  const gameStatus = useGameStore(state => state.gameStatus)
  const gameMode = useGameStore(state => state.gameMode)
  const stateTime = useGameStore(state => state.time)
  const updateTime = useGameStore(state => state.updateTime)
  const setGameStatus = useGameStore(store => store.setGameStatus)

  const [timer, setTimer] = useState(stateTime)
  const timeInterval = useRef<undefined | number>(undefined);

  useEffect(() => {
    gameStatus === STARTED || gameStatus === RUNNING ? startTimer() : pauseTimer()
  }, [gameStatus])

  useLayoutEffect(() => {
    if (gameStatus === READY) resetTimer()
  }, [gameMode, gameStatus])

  useEffect(() => {
    if (timer <= 0) setGameStatus(LOSE)
  }, [timer])

  //чтобы таймер не висел после unmount'а
  useEffect(() => {
    if (gameStatus === READY)
      setTimer(gameMode.time)
    return () => {
      clearInterval(timeInterval.current)
    }
  }, [])

  const startTimer = () => {
    timeInterval.current=(setInterval(() => {
      setTimer((prev) => prev - 10)
    }, 10))
  }

  const pauseTimer = () => {
    clearInterval(timeInterval.current)
    updateTime(timer)
  }

  const resetTimer = () => {
    setTimer(stateTime)
    clearInterval(timeInterval.current)
  }

  const minutes = Math.floor(timer / (60 * 1000))
  const seconds = Math.floor((timer / 1000 % 60))
  const ms = timer % 1000 / 10
  return (
    <h3>{`${minutes}:${zeroPad(seconds, 2)}.${zeroPad(ms, 2)}`}</h3>
  )
}

export default Timer