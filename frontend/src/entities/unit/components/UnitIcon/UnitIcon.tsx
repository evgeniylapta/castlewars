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
import { UnitName } from '../../types'
import { useUnitTypeName } from '../../hooks/useUnitTypeName'
import CustomImage from '../../../../shared/components/CustomImage/CustomImage'
import { UnitType } from '../../../../commonTypes'

function useUnitIcon(type?: UnitName) {
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

type Props = {
  unitTypeId: UnitType['id']
}

const UnitIcon: FC<Props> = ({ unitTypeId }) => {
  const foundTypeName = useUnitTypeName(unitTypeId)

  return (
    <CustomImage
      src={useUnitIcon(foundTypeName)?.src ?? ''}
      alt={foundTypeName ?? ''}
      width={20}
      height={20}
    />
  )
}

export default UnitIcon
