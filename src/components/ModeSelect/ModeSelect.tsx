import { gameModes } from "../../helpers/gameModes"
import { useGameStore } from "../../store/gameStore"

const ModeSelect = () => {
  const gameMode = useGameStore(state => state.gameMode)
  const changeGameMode = useGameStore(state => state.changeGameMode)
  // const gameModesWithoutCustom = gameModes.filter(v => v.name !== 'Custom')

  const selectOnChangeHandler: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    changeGameMode(e.target.value)
  }

  return (
    <div>
      <select className={'h-full'} defaultValue={gameMode.name} onChange={selectOnChangeHandler}>
        {gameModes.map((v, i) => (
          <option key={i} value={v.name}>{v.name}</option>
        ))}
      </select>
    </div>
  )
}

export default ModeSelect