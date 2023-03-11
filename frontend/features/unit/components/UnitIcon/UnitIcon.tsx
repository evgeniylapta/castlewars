import { FC } from 'react'
import clubswingerImg from '../../assets/Clubswinger.png'
import emperorCavalryImg from '../../assets/EmperorCavalry.png'
import legionnaireImg from '../../assets/Legionnaire.png'
import paladinImg from '../../assets/Paladin.png'
import phalanxImg from '../../assets/Phalanx.png'
import praetorianImg from '../../assets/Praetorian.png'
import spearfighterImg from '../../assets/Spearfighter.png'
import swordsmanImg from '../../assets/Swordsman.png'
import theutatesThunderImg from '../../assets/TheutatesThunder.png'
import { TUnitName, TUnitTypesResponseItem } from '../../types'
import { useUnitTypeName } from '../../hooks/useUnitTypeName'

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
  default:
    return undefined
  }
}

type TProps = {
  unitTypeId: TUnitTypesResponseItem['id']
}

const UnitIcon: FC<TProps> = ({ unitTypeId }) => {
  const foundType = useUnitTypeName(unitTypeId)

  const icon = useUnitIcon(foundType)

  if (!icon) {
    return null
  }

  return <img src={icon?.src} alt="" />
}

export default UnitIcon
