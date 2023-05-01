import { FC } from 'react'
import styles from './Tribe.module.scss'
import galusImg from '../../../widgets/infoPanel/assets/galus.png'
import romansImg from '../../../widgets/infoPanel/assets/romans.png'
import teautonsImg from '../../../widgets/infoPanel/assets/teautons.png'
import { useTribeTypeById } from '../../../entities/tribe'
import { useCastleContext } from '../../../entities/castle'
import CustomImage from '../../../shared/components/CustomImage/CustomImage'

function useTribeType() {
  const { selectedCastleQuery: { data } } = useCastleContext()
  return useTribeTypeById(data?.user.tribeTypeId)
}

function useTribeIcon() {
  switch (useTribeType()) {
  case 'Gaul':
    return galusImg
  case 'Roman':
    return romansImg
  case 'Teuton':
    return teautonsImg
  default:
    return undefined
  }
}

const Tribe: FC = () => (
  <div className={styles.wrap}>
    <CustomImage
      className={styles.img}
      src={useTribeIcon()?.src ?? ''}
      alt={useTribeType() ?? ''}
    />
    <span>{useTribeType()}</span>
  </div>
)

export default Tribe
