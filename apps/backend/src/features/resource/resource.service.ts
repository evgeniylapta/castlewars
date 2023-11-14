import { Castle, CastleResources } from '@prisma/client'
import { calculateCastleCold } from '@castlewars/shared-utils'
import { prisma } from '../../config/prisma'

export async function findResourcesByCastleId(castleId: Castle['id']) {
  return prisma.castleResources.findFirst({ where: { castleId } })
}

export function getAddCastleGoldOperation(castleResources: CastleResources, value: number) {
  return prisma.castleResources.update({
    where: {
      castleId: castleResources.castleId
    },
    data: {
      gold: calculateCastleCold(castleResources.gold, castleResources.goldLastUpdate) + value,
      goldLastUpdate: new Date()
    }
  })
}
