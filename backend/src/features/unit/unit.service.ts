import { prisma } from '../../config/prisma';
import { UnitType, UnitGroup, Castle, Attack } from '@prisma/client'

export type TUnitGroupUpdateAmountModel = { unitGroupId: UnitGroup['id'], newAmount: number, oldAmount: number, type: string }
export type TUnitGroupCreateModel = { amount: number, type: string, ownerCastleId?: Castle['id'], ownerAttackId?: Attack['id'], unitTypeId: UnitType['id'] }
export type TUnitGroupDeleteModel = { unitGroupId: UnitGroup['id'], type: string }

export async function findUnitTypes() {
  return await prisma.unitType.findMany();
}

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

function getSlowestUnitSpeed(unitTypes: UnitType[]) {
  return Math.min(...unitTypes.map(({ speed }) => speed))
}

export function getUnitTypesMovingMinutes(unitTypes: UnitType[], distance: number) {
  // return Math.ceil(60 / getSlowestUnitSpeed(unitTypes)) * distance
  return Math.ceil(0.07 / getSlowestUnitSpeed(unitTypes)) * distance
}

export function findUnitGroupByUnitType(unitGroups: UnitGroup[], unitType: UnitType) {
  return unitGroups.find(({ unitTypeId }) => unitTypeId === unitType.id)
}

export function getUnitGroupUpdateAmountOperation({ unitGroupId, newAmount, oldAmount, type }: TUnitGroupUpdateAmountModel) {
  console.log(`[${type}]`, 'unit group to update amount. Id:', unitGroupId, 'Old amount:', oldAmount, 'New amount:', newAmount);

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

export function getUnitGroupDeleteOperation({ unitGroupId, type }: TUnitGroupDeleteModel) {
  console.log(`[${type}]`, 'unit group to delete. Id:', unitGroupId);

  return (
    prisma.unitGroup.delete({
      where: {
        id: unitGroupId
      }
    })
  );
}

export function getUnitGroupCreateOperation({ amount, type, ownerCastleId, ownerAttackId, unitTypeId }: TUnitGroupCreateModel) {
  console.log(
    `[${type}]`,
    'unit group to create. Amount:', amount,
    'Owner castle id', ownerCastleId,
    'Owner attack id', ownerAttackId,
    'Unit type id', unitTypeId
  );

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
