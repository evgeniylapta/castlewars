import { Request } from 'express'
import { GetCastleAttacksQueryDto } from './dto/GetCastleAttacksQueryDto'
import { createAttack, findAttacksByUser } from './services/attack.service'
import { PostCreateAttackBodyDto } from './dto/PostCreateAttackBodyDto'
import { findCurrentUser } from '../user/user.service'
import { GetAttackHistoryQueryDto } from './dto/GetAttackHistoryQueryDto'
import { findCreateAttacksHistory } from './services/attackHistory.service'
import { CustomRequest } from '../../types/express'
import { findCastlesByUserId } from '../castle/castle.service'

export const getAttacksController = async (
  req: CustomRequest<true, object, GetCastleAttacksQueryDto>,
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

export const createAttackController = async (
  req: CustomRequest<true, PostCreateAttackBodyDto>,
  res
) => {
  const { data, castleId } = req.body

  const castles = await findCastlesByUserId(req.user.id)

  res.send(await createAttack(castles[0].id, castleId, data))
}
