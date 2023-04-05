import { UnitType, TribeType } from '@prisma/client'
import { prisma } from '../../../config/prisma'

export async function unitTypes() {
  return prisma.unitType.findMany()
}

export async function unitTypeById(typeById: UnitType['id']) {
  return (await unitTypes()).find(({ id }) => id === typeById)
}

export function unitTypesByTribeType(types: UnitType[], tribeType: TribeType) {
  return types.filter(({ tribeTypeId }) => tribeTypeId === tribeType.id)
}
