import React, { FC, useRef } from 'react'
import { scoreTablesLength, useGameStore } from '../../store/gameStore'
import { TGameModeParams } from '../../types/gameModeParams'

type TNameInputProps = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  time: number,
  gameMode: TGameModeParams
}

const NameInput: FC<TNameInputProps> = ({ setShowModal, time, gameMode}) => {
  const updateScoreTable = useGameStore(state => state.updateScoreTable)
  const name = useRef('')

  return (
    <div className='mt-3 md:text-xl'>
      <p>Отличный результат! Вы вошли в топ-{scoreTablesLength} игроков в своем режиме.</p>
      <p>Чтобы зафиксировать записть в таблице рекордов, введите, пожалуйста, свое имя.</p>
      <form className='flex gap-2 justify-center mt-2' onSubmit={(e) => {
        e.preventDefault()
        updateScoreTable(gameMode.name, name.current, gameMode.time - time)
        setShowModal(false)
      }}>
        <input className='py-1 px-2' type='text' placeholder='Как тебя зовут, чемпион?' onChange={e => name.current = e.target.value} />
        <button className='border border-[#e3e3e3]/[.25] w-10' type='submit'>Ok</button>
      </form>
    </div>
  )
}

export default NameInput