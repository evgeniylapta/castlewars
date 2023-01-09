import express from 'express';
import validateGuard from '../../middlewares/validate';
import { getCastleAttacksQueryDto } from './dto/getCastleAttacksQueryDto';
import { getAttacks } from './attack.controller';

const router = express.Router();

router.route('/')
  .get(validateGuard({ Query: getCastleAttacksQueryDto }), getAttacks)
  // .post(validateGuard({ Body: CastleCreateDto }), createCastle);

export default router;
