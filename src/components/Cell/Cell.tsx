import React, { FC } from 'react'
import { TFirstClickCellParams } from '../../types/firstClickCellParams'
import { TGameFieldCell } from '../../types/gameFieldCell';
import mine from '../../assets/images/mine.svg';
import { useGameStore } from '../../store/gameStore';
import { cellDigits, helpCellIcons, wrongFlag } from '../../helpers/cellIcons';
import { LOSE, PAUSED, WIN } from '../../helpers/gameStates';

type CellProps = {
  cellData: TGameFieldCell
  firstClick: TFirstClickCellParams,
  setFirstClick: (params: TFirstClickCellParams) => void,
  openCell: (x: number, y: number) => void,
  setHelperIcon: (x: number, y: number) => void,
}

const Cell: FC<CellProps> = ({
  cellData,
  firstClick,
  setFirstClick,
  openCell,
  setHelperIcon,
}) => {

  const gameStatus = useGameStore(store => store.gameStatus)
  const reactToFirstClick = () => {
    setFirstClick({
      ...firstClick,
      hasAlreadyBeen: true,
      x: cellData.x,
      y: cellData.y
    })
  }

  const helpIcon = Object.values(helpCellIcons)[cellData.helpIconIndex]
  const cellDone = gameStatus === PAUSED
  || gameStatus === WIN
  || gameStatus === LOSE
  || cellData.isOpened

  const onClickHandler: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!firstClick.hasAlreadyBeen) {
      reactToFirstClick()
      return
    }

    if (cellDone) {
      e.preventDefault()
    } else {
      openCell(cellData.x, cellData.y)
    }
  }

  const onRightClickHandler: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    if (!cellDone && firstClick.hasAlreadyBeen) {
      setHelperIcon(cellData.x, cellData.y)
    }
  }

  return (
    <div
      style={{
        backgroundColor: !cellData.isOpened ? 'rgb(142, 204, 57)' : 'rgb(229, 194, 159)',
      }}
      className={'select-none aspect-square w-full border-2 border-solid border-black border-opacity-60'}
      onClick={(e) => onClickHandler(e)}
      onContextMenu={(e) => onRightClickHandler(e)}
    >{ cellData.wrongFlag
      ? <img className={'w-full'} src={wrongFlag} alt='X - wrong flag' />
      : cellData.isOpened
        ?
        <>
          {cellData.withBomb
            ? (
              <img className={'w-full'} src={mine} alt='mine' />
            )
            : (
              cellData.bombsAround !== 0 &&
                <img
                  src={cellDigits[cellData.bombsAround-1]}
                  alt={`${cellData.bombsAround}`}
                  className='w-full'
                />
            )
          }
        </>
        :
        helpIcon && <img className={'w-full'} src={helpIcon} alt={Object.keys(helpCellIcons)[cellData.helpIconIndex]}/>
    }
    </div>
  )
}
export default Cell