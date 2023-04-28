import { FC } from 'react'
import styles from './Tribe.module.scss'
import galusImg from '../../assets/galus.png'
import romansImg from '../../assets/romans.png'
import teautonsImg from '../../assets/teautons.png'
import { useTribeTypeById } from '../../index'
import { useSelectedCastleDetailsContext } from '../../../castle'
import CustomImage from '../../../../shared/components/CustomImage/CustomImage'

function useTribeType() {
  const { castleDetailsQuery: { data: castleDetails } } = useSelectedCastleDetailsContext()
  return useTribeTypeById(castleDetails?.user.tribeTypeId)
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
