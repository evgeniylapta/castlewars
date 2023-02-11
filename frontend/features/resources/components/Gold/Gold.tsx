import { FC } from 'react';
import styles from './Gold.module.scss';
import { TClassNameable } from '../../../../shared/types';
import goldImg from '../../assets/gold.png';
import { useCastleResourcesContext } from '../../contexts/castleResourcesContext';

type TProps = TClassNameable

const Gold: FC<TProps> = ({ className}) => {
  const { calculatedGold } = useCastleResourcesContext()

  if (calculatedGold === undefined) {
    return null
  }

  return (
    <div className={styles.goldWrap}>
      <img className={styles.gold} src={goldImg.src} alt=""/>
      <span>{calculatedGold}</span>
    </div>
  )
}

export default Gold
