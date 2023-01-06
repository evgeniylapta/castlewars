import { prisma } from '../../config/prisma';

export async function findUnitTypes() {
  return await prisma.unitType.findMany();
}
