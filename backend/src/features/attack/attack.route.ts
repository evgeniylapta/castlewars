import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { GetCastleAttacksQueryDto } from './dto/GetCastleAttacksQueryDto';
import { createAttackController, getAttacksController } from './attack.controller';
import { PostCreateAttackBodyDto } from './dto/PostCreateAttackBodyDto';

const router = express.Router();

router.route('/')
  .get(validateRequest({ query: GetCastleAttacksQueryDto }), getAttacksController)
  .post(validateRequest({ body: PostCreateAttackBodyDto }), createAttackController);

export default router;
