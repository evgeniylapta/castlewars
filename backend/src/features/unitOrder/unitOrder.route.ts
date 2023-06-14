import express from 'express'
import { createUnitsOrderingController, getUnitsOrdersController } from './unitOrder.controller'
import validateRequest from '../../middlewares/validateRequest'
import { PostCreateUnitsOrderDto } from './dto/PostCreateUnitsOrderDto'
import { GetUnitsOrdersDto } from './dto/GetUnitsOrdersDto'
import { auth } from '../../middlewares/auth'

const router = express.Router()

// todo rename file
router.get(
  '/',
  auth(),
  validateRequest({ QueryDto: GetUnitsOrdersDto }),
  getUnitsOrdersController
)

router.post(
  '/create',
  auth(),
  validateRequest({ BodyDto: PostCreateUnitsOrderDto }),
  createUnitsOrderingController
)

export default router
