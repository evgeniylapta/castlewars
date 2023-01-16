import { Request } from 'express';
import { GetCastleAttacksQueryDto } from './dto/getCastleAttacksQueryDto';
import { createAttack, findAttacksByUser } from './attack.service';
import { PostCreateAttackBodyDto } from './dto/postCreateAttackBodyDto';
import { findCurrentUser } from '../user/user.service';
import { findUnitTypes } from '../unit/unit.service';

export const getAttacksController = async (req: Request<object, object, object, GetCastleAttacksQueryDto>, res) => {
  res.send(await findAttacksByUser(req.query.castleId));
};

// todo rename all
export const createAttackController = async (req: Request<object, object, PostCreateAttackBodyDto>, res) => {
  const { data, castleId } = req.body

  // todo change after auth implementation
  // todo right error codes
  const { castles } = await findCurrentUser()

  await createAttack(castles[0].id, castleId, data)

  // todo response
  res.send(true);
};
