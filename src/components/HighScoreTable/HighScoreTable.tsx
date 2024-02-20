import { FC } from 'react'
import { TGameModeNames } from '../../types/gameModeParams'
import { scoreTablesLength, useGameStore } from '../../store/gameStore'
import { zeroPad } from '../../helpers/timeFormatting'

const HighScoreTable: FC<{ name: TGameModeNames }> = ({ name }) => {
  const tableRows = useGameStore(state => state.scoreTables[name])
  const tableClassName = 'border border-slate-600 md:text-2xl'

  return (
    <div className='mt-4'>
      <h3 className='text-xl md:text-3xl font-medium ml-4'>{name}</h3>
      <div className='mt-2'>
        <table
          className='border-solid border-[10px] rounded-md border-[#6b6b6b] w-full'
        >
          <thead>
            <tr>
              <th className={tableClassName}>Номер</th>
              <th className={tableClassName}>Имя</th>
              <th className={tableClassName}>Время</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: scoreTablesLength }, (_v, i) => i).map((v, i) => {
              const timer = tableRows[v]?.time
              let minutes = 0, seconds = 0, ms = 0;
              if (timer) {
                minutes = Math.floor(timer / (60 * 1000))
                seconds = Math.floor((timer / 1000 % 60))
                ms = timer % 1000 / 10
              }
              return (
                <tr key={i}>
                  <td className={tableClassName}>{v + 1}</td>
                  <td className={tableClassName}>{tableRows[v]?.name}</td>
                  <td className={tableClassName}>
                    {timer
                      ? `${minutes}:${zeroPad(seconds, 2)}.${zeroPad(ms, 2)}`
                      : undefined
                    }
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default HighScoreTable