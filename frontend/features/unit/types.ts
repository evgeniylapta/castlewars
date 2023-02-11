type TRomanUnits = 'Legionnaire' | 'Praetorian' | 'Emperors cavalry'
type TGaulUnits = 'Phalanx' | 'Swordsman' | 'Theutates Thunder'
type TTeutonUnits = 'Clubswinger' | 'Spearfighter' | 'Paladin'

export type TUnitName = TRomanUnits | TGaulUnits | TTeutonUnits

export type TUnitTypesResponseItem = {
  id: string
  name: TUnitName
  attack: number
  defence: number
  speed: number
  carryingCapacity: number
  cropConsumption: number
  subsequence: number
}

export type TUnitTypesResponse = TUnitTypesResponseItem[]

export type TUnitGroup = {
  id: string
  unitTypeId: string
  amount: number
  ownerCastleId: string | null
  ownerAttackId: string | null
}

