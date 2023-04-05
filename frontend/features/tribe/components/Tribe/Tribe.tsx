import { FC } from 'react'
import styles from './Tribe.module.scss'
import galusImg from '../../assets/galus.png'
import romansImg from '../../assets/romans.png'
import teautonsImg from '../../assets/teautons.png'
import { TribeType } from '../../index'

function useTribeIcon(type: TribeType) {
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

type Props = {
  type: TribeType
}

const Tribe: FC<Props> = ({ type }) => {
  const icon = useTribeIcon(type)

  return (
    <div className={styles.wrap}>
      {icon && <img className={styles.img} src={icon.src} alt="" />}
      <span>{type}</span>
    </div>
  )
}

export default Tribe
