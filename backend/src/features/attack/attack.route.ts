import express from 'express';
import validateGuard from '../../middlewares/validate';
import { GetCastleAttacksQueryDto } from './dto/getCastleAttacksQueryDto';
import { createAttackController, getAttacksController } from './attack.controller';
import { PostCreateAttackBodyDto } from './dto/postCreateAttackBodyDto';

const router = express.Router();

router.route('/')
  .get(validateGuard({ Query: GetCastleAttacksQueryDto }), getAttacksController)
  .post(validateGuard({ Body: PostCreateAttackBodyDto }), createAttackController);

export default router;
