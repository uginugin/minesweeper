import { useGameStore } from "../../store/gameStore"

const FlagCounter = () => {
  const totalBombs = useGameStore(state => state.gameMode.bombsAmount)
  const bombsAmount = useGameStore(state => state.bombsAmount)
  
  return (
    <p>{totalBombs} - {bombsAmount}</p>
  )
}

export default FlagCounter