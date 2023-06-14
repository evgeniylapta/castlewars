import { GetCastleDetailsQueryDto } from './dto/GetCastleDetailsParamsDto'
import { prisma } from '../../config/prisma'
import { CustomRequest } from '../../types/express'

export const getUnitGroupsController = async (
  req: CustomRequest<true, object, GetCastleDetailsQueryDto>,
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
