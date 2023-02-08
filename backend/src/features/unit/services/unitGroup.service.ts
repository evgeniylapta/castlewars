import { prisma } from '../../../config/prisma';
import { UnitType, UnitGroup, Castle, Attack } from '@prisma/client'

export type TUnitGroupUpdateAmountModel = { unitGroupId: UnitGroup['id'], newAmount: number, oldAmount: number }
export type TUnitGroupCreateModel = { amount: number, ownerCastleId?: Castle['id'], ownerAttackId?: Attack['id'], unitTypeId: UnitType['id'] }
// export type TUnitGroupDeleteModel = { unitGroupId: UnitGroup['id'] }

export async function findUnitGroupsByCastleId(castleId: string) {
  return await prisma.unitGroup.findMany({
    where: {
      ownerCastleId: castleId
    },
  });
}

export async function findUnitGroupsByAttacksIdOrCastleId(attackIds: string | string[], castleIds: string | string[]) {
  return await prisma.unitGroup.findMany({
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
    },
  });
}

export function findUnitGroupByUnitType(unitGroups: UnitGroup[], unitType: UnitType) {
  return unitGroups.find(({ unitTypeId }) => unitTypeId === unitType.id)
}

export function getUnitGroupUpdateAmountOperation({ unitGroupId, newAmount }: TUnitGroupUpdateAmountModel) {

  return (
    prisma.unitGroup.update({
      where: {
        id: unitGroupId
      },
      data: {
        amount: newAmount
      }
    })
  );
}

export function getUnitGroupDeleteOperation(unitGroupId: UnitGroup['id']) {
  return (
    prisma.unitGroup.delete({
      where: {
        id: unitGroupId
      }
    })
  );
}

export function getUnitGroupCreateOperation({ amount, ownerCastleId, ownerAttackId, unitTypeId }: TUnitGroupCreateModel) {
  if (!ownerCastleId && !ownerAttackId) {
    throw new Error('Props ownerCastleId and ownerAttackId are not defined')
  }

  return (
    prisma.unitGroup.create({
      data: {
        amount,
        ownerCastleId,
        ownerAttackId,
        unitTypeId,
      }
    })
  );
}
