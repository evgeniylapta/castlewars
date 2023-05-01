import { FC } from 'react'
import classNames from 'classnames'
import styles from './Cell.module.scss'
import castle from '../../assets/castle.gif'
import { useCastleContext } from '../../../../entities/castle'
import { CellModel } from '../../types'

type Props = {
  cellModel: CellModel
}

const Cell: FC<Props> = ({
  cellModel: {
    castleId,
    isSelectedCastle,
    isOwnCastle
  }
}) => {
  const { setSelectedCastleId } = useCastleContext()
  const isCastle = !!castleId

  return (
    <div
      aria-hidden="true"
      onClick={() => setSelectedCastleId(castleId)}
      className={classNames(styles.mapItem, { [styles.selectable]: isCastle })}
    >
      {(isSelectedCastle || isOwnCastle) && (
        <div className={classNames(styles.selection, { [styles.current]: isOwnCastle })} />
      )}
      {isCastle && <img alt="Cell" src={castle.src} />}
    </div>
  )
}

export default Cell
