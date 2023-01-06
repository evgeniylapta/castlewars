import styles from './Cell.module.scss'
import castle from '../../assets/castle.gif'
import { FC } from 'react';
import classNames from 'classnames';
import { Point } from '../../types';
import { useSelectedMapPointContext } from '../../contexts/selectedMapPointContext';

type TProps = {
  isCastle: boolean,
  isOwnCastle: boolean,
  point: Point
}

const Cell: FC<TProps> = ({ isOwnCastle, isCastle, point: { x, y } }) => {
  const { setSelectedPoint, selectedPoint } = useSelectedMapPointContext()

  const isSelected = selectedPoint?.x === x && selectedPoint?.y === y;

  const isSelectable = isCastle

  return (
    <div
      onClick={() => isSelectable && setSelectedPoint({ x, y })}
      className={classNames(styles.mapItem, { [styles.selectable]: isSelectable })}
    >
      {(isSelected || isOwnCastle) && <div className={classNames(styles.selection, { [styles.current]: isOwnCastle })}></div>}
      {isCastle && <img src={castle.src}/>}
    </div>
  )
}

export default Cell
