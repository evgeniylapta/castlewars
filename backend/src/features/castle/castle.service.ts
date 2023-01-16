import { prisma } from '../../config/prisma';

export const findCastlesByCoordsRanges = async (minX: number, minY: number, maxX: number, maxY: number) => {
  return await prisma.castle.findMany({
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
};

const findCastleByIds = async (castleId: string) => {
  return await prisma.castle.findFirst({
    where: {
      id: castleId
    }
  })
};

export async function calculateDistanceBetweenCastles(castleFromId: string, castleToId: string) {
  const castleFrom = await findCastleByIds(castleFromId)
  const castleTo = await findCastleByIds(castleToId)

  return calculateDistanceBetweenPoints(castleFrom.x, castleFrom.y, castleTo.x, castleTo.y)
}

async function calculateDistanceBetweenPoints(x1: number, y1: number, x2: number, y2: number) {
  let resX;
  let resY;

  if(x1 > x2) {
    resX = x1 - x2;
  } else {
    resX = x2 - x1;
  }

  if(y1 > y2) {
    resY = y1 - y2;
  } else {
    resY = y2 - y1;
  }

  return resX + resY;
}


