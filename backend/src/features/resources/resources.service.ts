import { Castle, CastleResources } from '@prisma/client';
import { getCalculatedCastleCold } from 'sharedUtils';
import { prisma } from '../../config/prisma';

export async function addCastleGold(castleId: Castle['id'], castleResources: CastleResources, value: number) {
  return await getAddCastleGoldOperation(castleResources, value)
}

export function getAddCastleGoldOperation(castleResources: CastleResources, value: number) {
  return prisma.castleResources.update({
    where: {
      castleId: castleResources.castleId
    },
    data: {
      gold: getCalculatedCastleCold(castleResources.gold, castleResources.goldLastUpdate) + value,
      goldLastUpdate: new Date()
    }
  })
}
