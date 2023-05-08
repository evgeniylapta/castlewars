import { CastleResources } from '@prisma/client'
import { calculateCastleCold } from 'sharedUtils'
import { prisma } from '../../config/prisma'

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
