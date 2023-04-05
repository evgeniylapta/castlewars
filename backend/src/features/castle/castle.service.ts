import { calculateDistanceBetweenPoints } from 'sharedUtils'
import { prisma } from '../../config/prisma'

export const castlesByCoordsRanges = async (
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

const castleByIds = async (castleId: string) => prisma.castle.findFirst({
  where: {
    id: castleId
  }
})

export async function calculateDistanceBetweenCastles(castleFromId: string, castleToId: string) {
  const castleFrom = await castleByIds(castleFromId)
  const castleTo = await castleByIds(castleToId)

  return calculateDistanceBetweenPoints(castleFrom.x, castleFrom.y, castleTo.x, castleTo.y)
}
