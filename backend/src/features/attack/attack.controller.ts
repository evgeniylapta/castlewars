import { Request } from 'express'
import { GetCastleAttacksQueryDto } from './dto/GetCastleAttacksQueryDto'
import { createAttack, findAttacksByUser } from './services/attack.service'
import { PostCreateAttackBodyDto } from './dto/PostCreateAttackBodyDto'
import { findCurrentUser } from '../user/user.service'
import { GetAttackHistoryQueryDto } from './dto/GetAttackHistoryQueryDto'
import { findCreateAttacksHistory } from './services/attackHistory.service'

export const getAttacksController = async (
  req: Request<object, object, object, GetCastleAttacksQueryDto>,
  res
) => {
  res.send(await findAttacksByUser(req.query.castleId))
}

export const getAttacksHistoryController = async (
  req: Request<object, object, object, GetAttackHistoryQueryDto>,
  res
) => {
  res.send(await findCreateAttacksHistory(req.query))
}

// todo rename all
export const createAttackController = async (
  req: Request<object, object, PostCreateAttackBodyDto>,
  res
) => {
  const { data, castleId } = req.body

  // todo change after auth implementation
  // todo right error codes
  const { castles } = await findCurrentUser()

  await createAttack(castles[0].id, castleId, data)

  // todo response
  res.send(true)
}
