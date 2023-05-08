import {
  UnitType, UnitGroup, Castle, Attack
} from '@prisma/client'
import { prisma } from '../../../config/prisma'

export type UnitGroupUpdateAmountModel = { unitGroupId: UnitGroup['id'], newAmount: number, oldAmount: number }
export type UnitGroupCreateModel = { amount: number, ownerCastleId?: Castle['id'], ownerAttackId?: Attack['id'], unitTypeId: UnitType['id'] }
// export type TUnitGroupDeleteModel = { unitGroupId: UnitGroup['id'] }

export async function findUnitGroupsByCastleId(castleId: string) {
  return prisma.unitGroup.findMany({
    where: {
      ownerCastleId: castleId
    }
  })
}

// todo delete?
export async function getUnitGroupsByAttacksIdOrCastleId(
  attackIds: string | string[],
  castleIds: string | string[]
) {
  return prisma.unitGroup.findMany({
    where: {
      OR: [
        {
          ownerAttackId: {
            in: Array.isArray(attackIds) ? attackIds : [attackIds]
          }
        },
        {
          ownerCastleId: {
            in: Array.isArray(castleIds) ? castleIds : [castleIds]
          }
        }
      ]
    }
  })
}

export function getUnitGroupByUnitType(unitGroups: UnitGroup[], unitType: UnitType) {
  return unitGroups.find(({ unitTypeId }) => unitTypeId === unitType.id)
}

export function getUnitGroupUpdateAmountOperation(
  { unitGroupId, newAmount }: UnitGroupUpdateAmountModel
) {
  return (
    prisma.unitGroup.update({
      where: {
        id: unitGroupId
      },
      data: {
        amount: newAmount
      }
    })
  )
}

// todo delete?
export function getUnitGroupDeleteOperation(unitGroupId: UnitGroup['id']) {
  return (
    prisma.unitGroup.delete({
      where: {
        id: unitGroupId
      }
    })
  )
}

export function getUnitGroupCreateOperation({
  amount, ownerCastleId, ownerAttackId, unitTypeId
}: UnitGroupCreateModel) {
  if (!ownerCastleId && !ownerAttackId) {
    throw new Error('Props ownerCastleId and ownerAttackId are not defined')
  }

  return (
    prisma.unitGroup.create({
      data: {
        amount,
        ownerCastleId,
        ownerAttackId,
        unitTypeId
      }
    })
  )
}
