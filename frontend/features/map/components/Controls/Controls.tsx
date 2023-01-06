import styles from './Controls.module.scss'
import { FC } from 'react';
import arrowUp from '../../assets/arrow_up.png';
import arrowLeft from '../../assets/arrow_left.png';
import arrowRight from '../../assets/arrow_right.png';
import arrowDown from '../../assets/arrow_down.png';
import { useMapCenterContext } from '../../contexts/mapCenterContext';

const Controls: FC = () => {
  const { goBottom, goLeft, goRight, goTop } = useMapCenterContext()

  return (
    <div className={styles.arrows}>
      <div onClick={goTop} className={styles.top}>
        <img src={arrowUp.src}/>
      </div>
      <div onClick={goLeft} className={styles.left}>
        <img src={arrowLeft.src}/>
      </div>
      <div onClick={goRight} className={styles.right}>
        <img src={arrowRight.src}/>
      </div>
      <div onClick={goBottom} className={styles.bottom}>
        <img src={arrowDown.src}/>
      </div>
    </div>
  )
}

export default Controls
