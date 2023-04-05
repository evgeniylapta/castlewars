import express from 'express'
import { createUnitCreatingController } from './unit.controller'
import validateRequest from '../../middlewares/validateRequest'
import { PostCreateUnitOrderDto } from './dto/PostCreateUnitOrderDto'

const router = express.Router()

router.post(
  '/order',
  validateRequest({ BodyDto: PostCreateUnitOrderDto }),
  createUnitCreatingController
)

export default router
