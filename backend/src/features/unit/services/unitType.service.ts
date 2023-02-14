import { prisma } from '../../../config/prisma';
import { UnitType, TribeType } from '@prisma/client'

export async function findUnitTypes() {
  return await prisma.unitType.findMany();
}

export async function findUnitTypeById(typeById: UnitType['id']) {
  return (await findUnitTypes()).find(({ id }) => id === typeById)
}

export function getUnitTypesByTribeType(unitTypes: UnitType[], tribeType: TribeType) {
  return unitTypes.filter(({ tribeTypeId }) => tribeTypeId === tribeType.id);
}
