type RomanUnits = 'Legionnaire' | 'Praetorian' | 'Emperors cavalry'
type GaulUnits = 'Phalanx' | 'Swordsman' | 'Theutates Thunder'
type TeutonUnits = 'Clubswinger' | 'Spearfighter' | 'Paladin'

export type UnitName = RomanUnits | GaulUnits | TeutonUnits

export type UnitTypesResponseItem = {
  id: string
  name: UnitName
  attack: number
  defence: number
  speed: number
  carryingCapacity: number
  cropConsumption: number
  subsequence: number
  tribeTypeId: string
  goldPrice: number
}

export type UnitTypesResponse = UnitTypesResponseItem[]

export type UnitGroup = {
  id: string
  unitTypeId: string
  amount: number
  ownerCastleId: string | null
  ownerAttackId: string | null
}
