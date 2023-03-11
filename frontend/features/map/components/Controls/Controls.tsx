import { FC } from 'react'
import styles from './Controls.module.scss'
import arrowUp from '../../assets/arrow_up.png'
import arrowLeft from '../../assets/arrow_left.png'
import arrowRight from '../../assets/arrow_right.png'
import arrowDown from '../../assets/arrow_down.png'
import { useMapCenterContext } from '../../contexts/mapCenterContext'

const Controls: FC = () => {
  const {
    goBottom, goLeft, goRight, goTop
  } = useMapCenterContext()

  return (
    <div className={styles.arrows}>
      <div aria-hidden="true" onClick={goTop} className={styles.top}>
        <img alt="arrowUp" src={arrowUp.src} />
      </div>
      <div aria-hidden="true" onClick={goLeft} className={styles.left}>
        <img alt="arrowLeft" src={arrowLeft.src} />
      </div>
      <div aria-hidden="true" onClick={goRight} className={styles.right}>
        <img alt="arrowRight" src={arrowRight.src} />
      </div>
      <div aria-hidden="true" onClick={goBottom} className={styles.bottom}>
        <img alt="arrowDown" src={arrowDown.src} />
      </div>
    </div>
  )
}

export default Controls
