import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { GetCastleDetailsQueryDto } from './dto/GetCastleDetailsParamsDto'
import { getUnitGroupsController } from './unitGroup.controller'
import { auth } from '../../middlewares/auth'

const router = express.Router()

router.get(
  '/',
  auth(),
  validateRequest({ QueryDto: GetCastleDetailsQueryDto }),
  getUnitGroupsController
)

export default router
