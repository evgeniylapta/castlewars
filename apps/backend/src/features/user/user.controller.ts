import { Response } from 'express'
import { CustomRequest } from '../../types/express'
import catchAsync from '../../utils/catchAsync'
import { prisma } from '../../config/prisma'

export const myUserController = catchAsync(
  async (req: CustomRequest<true>, res: Response) => {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id
      },
      include: {
        castles: true
      }
    })

    res.send({
      userId: user.id,
      name: user.name,
      tribeTypeId: user.tribeTypeId,
      role: user.role,
      castleId: user.castles[0].id
    })
  }
)
