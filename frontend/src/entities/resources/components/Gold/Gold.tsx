import { FC } from 'react'
import styles from './Gold.module.scss'
import goldImg from '../../assets/gold.png'
import { useCastleResourcesContext } from '../../contexts/castleResourcesContext'
import CustomImage from '../../../../shared/components/CustomImage/CustomImage'

const Gold: FC = () => (
  <span className={styles.goldWrap}>
    <CustomImage
      src={goldImg.src}
      alt="Gold"
      width={25}
      height={25}
    />
    <span>{useCastleResourcesContext().calculatedGold}</span>
  </span>
)

export default Gold
