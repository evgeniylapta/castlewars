import { FC } from 'react';
import styles from './Tribe.module.scss';
import galusImg from '../../assets/galus.png';
import romansImg from '../../assets/romans.png';
import teautonsImg from '../../assets/teautons.png';
import { TTribeType } from '../../../tribe';

function useTribeIcon(type: TTribeType) {
  switch (type) {
    case 'Gaul':
      return galusImg
    case 'Roman':
      return romansImg
    case 'Teuton':
      return teautonsImg
  }
}

type TProps = {
  type: TTribeType
}

const Tribe: FC<TProps> = ({ type }) => {
  const icon = useTribeIcon(type)

  console.log(type);

  return (
    <div className={styles.wrap}>
      <img className={styles.img} src={icon.src} alt=""/>
      <span>{type}</span>
    </div>
  )
}

export default Tribe
