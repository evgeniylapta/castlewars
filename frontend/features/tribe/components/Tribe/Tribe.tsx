import { FC } from 'react'
import styles from './Tribe.module.scss'
import galusImg from '../../assets/galus.png'
import romansImg from '../../assets/romans.png'
import teautonsImg from '../../assets/teautons.png'
import { TribeType, useTribeTypeById } from '../../index'
import { useSelectedCastleDetailsContext } from '../../../castle'

function useTribeIcon(type?: TribeType) {
  switch (type) {
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

const Tribe: FC = () => {
  const { castleDetailsQuery: { data: castleDetails } } = useSelectedCastleDetailsContext()
  const tribeType = useTribeTypeById(castleDetails?.user.tribeTypeId)
  const icon = useTribeIcon(tribeType)

  return (
    <div className={styles.wrap}>
      {icon && <img className={styles.img} src={icon.src} alt="" />}
      <span>{tribeType}</span>
    </div>
  )
}

export default Tribe
