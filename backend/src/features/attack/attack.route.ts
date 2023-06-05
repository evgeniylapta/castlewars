import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { GetCastleAttacksQueryDto } from './dto/GetCastleAttacksQueryDto'
import { createAttackController, getAttacksController, getAttacksHistoryController } from './attack.controller'
import { PostCreateAttackBodyDto } from './dto/PostCreateAttackBodyDto'
import { GetAttackHistoryQueryDto } from './dto/GetAttackHistoryQueryDto'

const router = express.Router()

router.route('/')
  .get(validateRequest({ QueryDto: GetCastleAttacksQueryDto }), getAttacksController)
  .post(validateRequest({ BodyDto: PostCreateAttackBodyDto }), createAttackController)

router.get(
  '/history',
  validateRequest({ QueryDto: GetAttackHistoryQueryDto }),
  getAttacksHistoryController
)

export default router
