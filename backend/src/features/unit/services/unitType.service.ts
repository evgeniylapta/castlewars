import { prisma } from '../../../config/prisma';
import { UnitType, TribeType } from '@prisma/client'

export async function findUnitTypes() {
  return await prisma.unitType.findMany();
}

export function getUnitTypesByTribeType(unitTypes: UnitType[], tribeType: TribeType) {
  return unitTypes.filter(({ tribeTypeId }) => tribeTypeId === tribeType.id);
}

function getSlowestUnitSpeed(unitTypes: UnitType[]) {
  return Math.min(...unitTypes.map(({ speed }) => speed))
}

export function getUnitTypesMovingMinutes(unitTypes: UnitType[], distance: number) {
  // return Math.ceil(60 / getSlowestUnitSpeed(unitTypes)) * distance
  return (getSlowestUnitSpeed(unitTypes) / 8) * distance
}

// export function getMinimalInSeconds(unitTypes: UnitType) {
//   return (getSlowestUnitSpeed(unitTypes) / 8) * distance
// }
