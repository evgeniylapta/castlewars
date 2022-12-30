import styles from './Numbers.module.scss'
import { FC } from 'react';
import classNames from 'classnames';
import { useMapContext } from '../../contexts/mapContext';

const Numbers: FC = () => {
  const { numbers: { x: xNumbers, y: yNumbers } } = useMapContext()

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
