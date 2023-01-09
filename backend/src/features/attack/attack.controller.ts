import { Request } from 'express';
import { getCastleAttacksQueryDto } from './dto/getCastleAttacksQueryDto';
import { findAttacksByUser } from './attack.service';

export const getAttacks = async (req: Request<object, object, object, getCastleAttacksQueryDto>, res) => {
  res.send(await findAttacksByUser(req.query.castleId));
};

// export const createAttack = async (req: Request<object, object, object, GetCastlesQueryDto>, res) => {
//   res.send(await prisma.castle.findMany());
// };
