import { Link } from "react-router-dom"
import FlagCounter from "../components/FlagCounter/FlagCounter"
import GameField from "../components/GameField/GameField"
import ModeSelect from "../components/ModeSelect/ModeSelect"
import StartStopButtons from "../components/StartStopButtons/StartStopButtons"
import Timer from "../components/Timer/Timer"
import timeIcon from '../assets/images/time.svg'
import { useGameStore } from "../store/gameStore"

const GamePage = () => {
  const gameStatus = useGameStore(state => state.gameStatus)

  return (
    <div>
      <h2 className="text-4xl font-medium">{gameStatus.toUpperCase()}</h2>
      <div className="mt-8 md:w-1/2 lg:w-1/3 mx-auto">
        <div className="flex text-3xl justify-start gap-3">
          <img src={timeIcon} alt={'time icon'} className="w-7" />
          <Timer />
          <div className="ml-auto">
            <FlagCounter />
          </div>
        </div>
        <div className="flex justify-between h-10 mt-3 md:text-1xl">
          <StartStopButtons />
          <ModeSelect />
        </div>
      </div>
      <div className="mt-5">
        <GameField />
      </div>
      <div className="mt-5 md:text-xl">
        <Link to='/highScores'>Перейти к рекордам </Link>
      </div>
    </div>
  )
}

export default GamePage