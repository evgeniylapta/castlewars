import { CastleResources } from '@prisma/client'
import { calculatedCastleCold } from 'sharedUtils'
import { prisma } from '../../config/prisma'

export function operationAddCastleGold(castleResources: CastleResources, value: number) {
  return prisma.castleResources.update({
    where: {
      castleId: castleResources.castleId
    },
    data: {
      gold: calculatedCastleCold(castleResources.gold, castleResources.goldLastUpdate) + value,
      goldLastUpdate: new Date()
    }
  })
}
