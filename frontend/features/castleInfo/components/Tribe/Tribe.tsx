import { FC } from 'react';
import { TTribeType } from '../../../auth';
import styles from './Tribe.module.scss';
import galusImg from '../../assets/galus.png';
import romansImg from '../../assets/romans.png';
import teautonsImg from '../../assets/teautons.png';

function useTribeIcon(type: TTribeType) {
  switch (type) {
    case 'gaul':
      return galusImg
    case 'roman':
      return romansImg
    case 'teuton':
      return teautonsImg
  }
}

type TProps = {
  type: TTribeType
}

const Tribe: FC<TProps> = ({ type }) => {
  const icon = useTribeIcon(type)

  return (
    <div className={styles.wrap}>
      <img className={styles.img} src={icon.src} alt=""/>
      <span>{type}</span>
    </div>
  )
}

export default Tribe
