import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { GetCastleAttacksQueryDto } from './dto/GetCastleAttacksQueryDto'
import { createAttackController, getAttacksController, getAttacksHistoryController } from './attack.controller'
import { PostCreateAttackBodyDto } from './dto/PostCreateAttackBodyDto'
import { GetAttackHistoryQueryDto } from './dto/GetAttackHistoryQueryDto'
import { auth } from '../../middlewares/auth'

const router = express.Router()

router.route('/')
  .get(auth(), validateRequest({ QueryDto: GetCastleAttacksQueryDto }), getAttacksController)
  .post(auth(), validateRequest({ BodyDto: PostCreateAttackBodyDto }), createAttackController)

router.get(
  '/history',
  validateRequest({ QueryDto: GetAttackHistoryQueryDto }),
  getAttacksHistoryController
)

export default router
