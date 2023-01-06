import styles from './Numbers.module.scss'
import { FC } from 'react';
import classNames from 'classnames';
import { useMapPointsContext } from '../../contexts/mapPointsContext';

const Numbers: FC = () => {
  const { numbers: { x: xNumbers, y: yNumbers } } = useMapPointsContext()

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
