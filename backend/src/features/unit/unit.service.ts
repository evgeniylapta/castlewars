import { prisma } from '../../config/prisma';

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
