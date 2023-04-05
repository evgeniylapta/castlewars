import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { GetCastleAttacksQueryDto } from './dto/GetCastleAttacksQueryDto'
import { createAttackController, attacksController } from './attack.controller'
import { PostCreateAttackBodyDto } from './dto/PostCreateAttackBodyDto'

const router = express.Router()

router.route('/')
  .get(validateRequest({ QueryDto: GetCastleAttacksQueryDto }), attacksController)
  .post(validateRequest({ BodyDto: PostCreateAttackBodyDto }), createAttackController)

export default router
