import { Request } from 'express'
import { GetCastlesQueryDto } from './dto/GetCastlesQueryDto'
import {
  findCastlesByCoordsRanges
} from './castle.service'
import { GetCastleDetailsQueryDto } from './dto/GetCastleDetailsQueryDto'
import { prisma } from '../../config/prisma'

export const getCastlesController = async (
  req: Request<object, object, object, GetCastlesQueryDto>,
  res
) => {
  const {
    minX, minY, maxX, maxY
  } = req.query
  res.send(await findCastlesByCoordsRanges(Number(minX), Number(minY), Number(maxX), Number(maxY)))
}

export const getCastleDetailsController = async (
  req: Request<object, object, object, GetCastleDetailsQueryDto>,
  res
) => {
  const castle = await prisma.castle.findFirst({
    where: {
      id: req.query.castleId
    },
    include: {
      user: true,
      castleResources: true
    }
  })

  res.send(castle)
}
