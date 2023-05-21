import { UnitType, TribeType } from '@prisma/client'
import { prisma } from '../../config/prisma'

export async function findUnitTypes() {
  return prisma.unitType.findMany()
}

export function getUnitTypeById(types: UnitType[], typeById: UnitType['id']) {
  return types.find(({ id }) => id === typeById)
}

export function getUnitTypesByTribeType(types: UnitType[], tribeType: TribeType) {
  return types.filter(({ tribeTypeId }) => tribeTypeId === tribeType.id)
}
