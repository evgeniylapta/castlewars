import { UnitType } from '../../commonTypes'

type RomanUnits = 'Legionnaire' | 'Praetorian' | 'Emperors cavalry'
type GaulUnits = 'Phalanx' | 'Swordsman' | 'Theutates Thunder'
type TeutonUnits = 'Clubswinger' | 'Spearfighter' | 'Paladin'

export type UnitName = RomanUnits | GaulUnits | TeutonUnits

export type OrderUnitsFormData = { [key: UnitType['id']]: string }
