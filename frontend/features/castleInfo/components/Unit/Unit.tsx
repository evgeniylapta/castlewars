import { FC } from 'react';
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
import { TUnitName, useUnitTypesContext } from '../../../unit';
import { TUnitGroup } from '../../../castle';
import classNames from 'classnames';
import styles from './Unit.module.scss';

function useUnitIcon(type?: TUnitName) {
  switch (type) {
    case 'Clubswinger':
      return clubswingerImg
    case 'Emperors cavalry':
      return emperorCavalryImg
    case 'Paladin':
      return paladinImg
    case 'Legionnaire':
      return legionnaireImg
    case 'Phalanx':
      return phalanxImg
    case 'Praetorian':
      return praetorianImg
    case 'Spearfighter':
      return spearfighterImg
    case 'Swordsman':
      return swordsmanImg
    case 'Theutates Thunder':
      return theutatesThunderImg
  }
}

type TProps = {
  unitGroup: TUnitGroup
} & TClassNameable

const Unit: FC<TProps> = ({ unitGroup: { unitTypeId, amount }, className }) => {
  const { unitTypesQuery: { data: unitTypes } } = useUnitTypesContext()

  const foundType = unitTypes?.find(({ id }) => id === unitTypeId)?.name

  const icon = useUnitIcon(foundType)

  return (
    <div className={classNames(className, styles.wrap)}>
      <img src={icon?.src} alt=""/>
      <span>{amount}</span>
    </div>
  )
}

export default Unit
