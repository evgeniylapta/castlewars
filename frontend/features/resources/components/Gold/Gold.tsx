import { FC } from 'react'
import styles from './Gold.module.scss'
import goldImg from '../../assets/gold.png'
import { useCastleResourcesContext } from '../../contexts/castleResourcesContext'

const Gold: FC = () => {
  const { calculatedGold } = useCastleResourcesContext()

  if (calculatedGold === undefined) {
    return null
  }

  return (
    <div className={styles.goldWrap}>
      <img className={styles.gold} src={goldImg.src} alt="Gold" />
      <span>{calculatedGold}</span>
    </div>
  )
}

export default Gold
