import express from 'express'
import { createUnitsOrderingController, getUnitsOrdersController } from './unitOrder.controller'
import validateRequest from '../../middlewares/validateRequest'
import { PostCreateUnitsOrderDto } from './dto/PostCreateUnitsOrderDto'
import { GetUnitsOrdersDto } from './dto/GetUnitsOrdersDto'

const router = express.Router()

// todo rename file
router.get(
  '/',
  validateRequest({ QueryDto: GetUnitsOrdersDto }),
  getUnitsOrdersController
)

router.post(
  '/create',
  validateRequest({ BodyDto: PostCreateUnitsOrderDto }),
  createUnitsOrderingController
)

export default router
