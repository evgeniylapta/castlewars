import { prisma } from '../../config/prisma';

export async function findAttacksByUser(castleId: string) {
  return await prisma.attack.findMany({
    where: {
      OR: [
        {castleToId: castleId},
        {castleFromId: castleId}
      ]
    },
    include: {
      unitGroups: true,
      castleFrom: {
        include: {
          user: true
        }
      },
      castleTo: {
        include: {
          user: true
        }
      }
    }
  });
}
