import { FC } from 'react';
import styles from './Gold.module.scss';
import { TClassNameable } from '../../../../shared/types';
import goldImg from '../../assets/gold.png';
import { useSelectedCastleDetailsContext } from '../../../castle';

type TProps = TClassNameable

const Gold: FC<TProps> = ({ className}) => {
  const { castleDetailsQuery: { data: castleDetails } } = useSelectedCastleDetailsContext()

  if (!castleDetails) {
    return null
  }

  return (
    <div className={styles.goldWrap}>
      <img className={styles.gold} src={goldImg.src} alt=""/>
      <span>{castleDetails?.castleResources?.gold}</span>
    </div>
  )
}

export default Gold
