import { calculateDistanceBetweenPoints } from 'sharedUtils'
import { prisma } from '../../config/prisma'

export const findCastlesByCoordsRanges = async (
  minX: number,
  minY: number,
  maxX: number,
  maxY: number
) => prisma.castle.findMany({
  where: {
    AND: [
      { x: { gte: minX } },
      { x: { lte: maxX } },
      { y: { gte: minY } },
      { y: { lte: maxY } }
    ]
  },
  include: {
    user: true
  }
})

const findCastleByIds = async (castleId: string) => prisma.castle.findFirst({
  where: {
    id: castleId
  }
})

export async function calculateDistanceBetweenCastles(castleFromId: string, castleToId: string) {
  const castleFrom = await findCastleByIds(castleFromId)
  const castleTo = await findCastleByIds(castleToId)

  return calculateDistanceBetweenPoints(castleFrom.x, castleFrom.y, castleTo.x, castleTo.y)
}
