import { FC, useMemo } from 'react'
import classNames from 'classnames'
import styles from './Numbers.module.scss'
import { extremePoints } from '../../utils/extremePoints'
import { useMapContext } from '../../contexts/mapContext'
import { mapSize } from '../../utils/mapSize'

function useNumbers() {
  const { centerPoint, isExpanded } = useMapContext()
  const { startPoint } = extremePoints(centerPoint, mapSize(isExpanded))

  const xNumbers = useMemo(() => Array.from(Array(mapSize(isExpanded)))
    .map((_, index) => startPoint.x + index), [startPoint])

  const yNumbers = useMemo(() => Array.from(Array(mapSize(isExpanded)))
    .map((_, index) => startPoint.y + index)
    .reverse(), [startPoint])

  return { xNumbers, yNumbers }
}

const Numbers: FC = () => {
  const { xNumbers, yNumbers } = useNumbers()

  return (
    <>
      <div className={classNames(styles.mapNumbers, styles.mapNumbersBottom)}>
        {xNumbers.map((number) => <div key={number}>{number}</div>)}
      </div>
      <div className={classNames(styles.mapNumbers, styles.mapNumbersLeft)}>
        {yNumbers.map((number) => <div key={number}>{number}</div>)}
      </div>
    </>
  )
}

export default Numbers
