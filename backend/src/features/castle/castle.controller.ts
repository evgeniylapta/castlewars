import { Request } from 'express'
import { GetCastleRangeQueryDto } from './dto/GetCastleRangeQueryDto'
import {
  findCastlesByCoordsRanges
} from './castle.service'
import { GetCastleDetailsParamsDto } from './dto/GetCastleDetailsParamsDto'
import { prisma } from '../../config/prisma'
import { CustomRequest } from '../../types/express'

export const getCastlesController = async (
  req: CustomRequest<true, object, GetCastleRangeQueryDto>,
  res
) => {
  const {
    minX, minY, maxX, maxY
  } = req.query
  res.send(await findCastlesByCoordsRanges(Number(minX), Number(minY), Number(maxX), Number(maxY)))
}

export const getCastleDetailsController = async (
  req: CustomRequest<true, object, object, GetCastleDetailsParamsDto>,
  res
) => {
  // todo move to service
  const castle = await prisma.castle.findFirst({
    where: {
      id: req.params.castleId
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          tribeTypeId: true
        }
      },
      castleResources: true
    }
  })

  res.send(castle)
}
