import { FC } from 'react'
import styles from './Gold.module.scss'
import goldImg from '../../assets/gold.png'
import { useCastleContext } from '../../../../entities/castle'
import { useCalculatedGoldInterval, useResourcesQuery } from '../../../../entities/resources'
import { CustomImage } from '../../../../shared'

function useCalculatedGold() {
  const { data } = useResourcesQuery(useCastleContext().selectedCastleQuery.data?.id)
  return useCalculatedGoldInterval(data)
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
