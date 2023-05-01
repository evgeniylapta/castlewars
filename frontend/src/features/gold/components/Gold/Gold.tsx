import { FC } from 'react'
import styles from './Gold.module.scss'
import goldImg from '../../assets/gold.png'
import CustomImage from '../../../../shared/components/CustomImage/CustomImage'
import { useCalculatedGoldInterval } from '../../../../entities/gold'
import { useCastleContext } from '../../../../entities/castle'

function useCalculatedGold() {
  const { selectedCastleQuery: { data: selectedCastle } } = useCastleContext()
  return useCalculatedGoldInterval(
    selectedCastle?.castleResources.gold,
    selectedCastle?.castleResources.goldLastUpdate
  )
}

const Gold: FC = () => (
  <span className={styles.goldWrap}>
    <CustomImage
      src={goldImg.src}
      alt="Gold"
      width={25}
      height={25}
    />
    <span>{useCalculatedGold()}</span>
  </span>
)

export default Gold
