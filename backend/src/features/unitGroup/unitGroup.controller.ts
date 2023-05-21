import { Request } from 'express'
import { GetCastleDetailsQueryDto } from './dto/GetCastleDetailsParamsDto'
import { prisma } from '../../config/prisma'

export const getUnitGroupsController = async (
  req: Request<object, object, object, GetCastleDetailsQueryDto>,
  res
) => {
  res.send(await prisma.unitGroup.findMany({
    where: {
      ownerCastleId: req.query.castleId
    },
    orderBy: {
      unitType: {
        subsequence: 'asc'
      }
    }
  }))
}
