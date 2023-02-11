import { prisma } from '../../../config/prisma';
import { UnitType, TribeType } from '@prisma/client'
import { UNIT_BASE_SPEED_PER_CELL_INTERVAL_SECONDS } from '../config';

export async function findUnitTypes() {
  return await prisma.unitType.findMany();
}

export async function findUnitTypeById(typeById: UnitType['id']) {
  return (await findUnitTypes()).find(({ id }) => id === typeById)
}

export function getUnitTypesByTribeType(unitTypes: UnitType[], tribeType: TribeType) {
  return unitTypes.filter(({ tribeTypeId }) => tribeTypeId === tribeType.id);
}

function getSlowestUnitSpeed(unitTypes: UnitType[]) {
  return Math.min(...unitTypes.map(({ speed }) => speed))
}

export function getUnitTypesMovingSeconds(unitTypes: UnitType[], distance: number) {
  return Math.ceil(UNIT_BASE_SPEED_PER_CELL_INTERVAL_SECONDS / getSlowestUnitSpeed(unitTypes)) * distance
}
