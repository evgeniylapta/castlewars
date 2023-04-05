import { Request } from 'express'
import { prisma } from '../../config/prisma'
import { CastleCreateDto } from './dto/CastleCreateDto'
import { currentUser } from '../user/user.service'
import { GetCastlesQueryDto } from './dto/GetCastlesQueryDto'
import { GetCastleDetailsQueryDto } from './dto/GetCastleDetailsQueryDto'
import {
  calculateDistanceBetweenCastles,
  castlesByCoordsRanges
} from './castle.service'
import { GetDistanceBetweenCastlesQueryDto } from './dto/GetDistanceBetweenPointsQueryDto'

export const castlesController = async (
  req: Request<object, object, object, GetCastlesQueryDto>,
  res
) => {
  const {
    minX, minY, maxX, maxY
  } = req.query

  res.send(await castlesByCoordsRanges(Number(minX), Number(minY), Number(maxX), Number(maxY)))
}

// todo type
export const currentUserCastleController = async (req, res) => {
  const { id: userId } = await currentUser()

  res.send(await prisma.castle.findFirst({ where: { userId } }))
}

export const castleDetails = async (
  req: Request<object, object, object, GetCastleDetailsQueryDto>,
  res
) => {
  const { castleId } = req.query

  const castle = await prisma.castle.findFirst({
    where: {
      id: castleId
    },
    include: {
      unitGroups: true,
      castleResources: true,
      user: true
    }
  })

  res.send(castle)
}

export const createCastleController = async (
  req: Request<object, object, CastleCreateDto>,
  res
) => {
  const { y, x, userId } = req.body

  res.send(await prisma.castle.create({
    data: { userId, y, x }
  }))
}

export const distanceBetweenCastlesController = async (
  req: Request<object, object, object, GetDistanceBetweenCastlesQueryDto>,
  res
) => {
  const { fromCastleId, toCastleId } = req.query

  res.send(await calculateDistanceBetweenCastles(fromCastleId, toCastleId))
}
