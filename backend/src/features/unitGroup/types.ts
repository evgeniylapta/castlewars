import {
  Attack, Castle, UnitGroup, UnitType
} from '@prisma/client'

export type UnitGroupUpdateAmountModel = {
  unitGroupId: UnitGroup['id'],
  unitTypeId: UnitType['id'],
  newAmount: number,
  oldAmount: number
}

export type UnitGroupCreateModel = {
  amount: number,
  ownerCastleId?: Castle['id'],
  ownerAttackId?: Attack['id'],
  unitTypeId: UnitType['id']
}
