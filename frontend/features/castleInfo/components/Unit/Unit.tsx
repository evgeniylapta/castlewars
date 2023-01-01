import { FC } from 'react';
import { TUnitType } from '../../types';
import styles from './Unit.module.scss';
import clubswingerImg from '../../assets/Clubswinger.png';
import emperorCavalryImg from '../../assets/EmperorCavalry.png';
import legionnaireImg from '../../assets/Legionnaire.png';
import paladinImg from '../../assets/Paladin.png';
import phalanxImg from '../../assets/Phalanx.png';
import praetorianImg from '../../assets/Praetorian.png';
import spearfighterImg from '../../assets/Spearfighter.png';
import swordsmanImg from '../../assets/Swordsman.png';
import theutatesThunderImg from '../../assets/TheutatesThunder.png';
import { TClassNameable } from '../../../../shared/types';
import classNames from 'classnames';

function useUnitIcon(type: TUnitType) {
  switch (type) {
    case 'clubswinger':
      return clubswingerImg
    case 'emperor cavalry':
      return emperorCavalryImg
    case 'paladin':
      return paladinImg
    case 'legionnaire':
      return legionnaireImg
    case 'phalanx':
      return phalanxImg
    case 'praetorian':
      return praetorianImg
    case 'spearfighter':
      return spearfighterImg
    case 'swordsman':
      return swordsmanImg
    case 'theutates thunder':
      return theutatesThunderImg
  }
}

type TProps = {
  type: TUnitType,
  amount: number
} & TClassNameable

const Unit: FC<TProps> = ({ type, amount, className }) => {
  const icon = useUnitIcon(type)

  return (
    <div className={classNames(className, styles.wrap)}>
      <img src={icon.src} alt=""/>
      <span>{amount}</span>
    </div>
  )
}

export default Unit
