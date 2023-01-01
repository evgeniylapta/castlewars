export type TTribeType = 'roman' | 'gaul' | 'teuton'

export type TRomanUnits = 'legionnaire' | 'praetorian' | 'emperor cavalry'
export type TGaulUnits = 'phalanx' | 'swordsman' | 'theutates thunder'
export type TTeutonUnits = 'clubswinger' | 'spearfighter' | 'paladin'

export type TUnitType = TRomanUnits | TGaulUnits | TTeutonUnits

export type TUnit = {
  type: TUnitType,
  amount: number
}

export type CastleInfo = {
  money: number,
  tribe: TTribeType
  units: TUnit[]
  userId: number
}

