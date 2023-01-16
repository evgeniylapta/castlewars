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
import { TUnitGroup, TUnitName } from '../../types';
import { useUnitTypeName } from '../../hooks/getUnitTypeName';

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

const UnitIcon: FC<TProps> = ({ unitGroup, className }) => {
  const foundType = useUnitTypeName(unitGroup)

  const icon = useUnitIcon(foundType)

  return (
    <img src={icon?.src} alt=""/>
  )
}

export default UnitIcon
