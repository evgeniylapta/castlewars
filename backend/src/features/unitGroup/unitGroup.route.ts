import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { GetCastleDetailsQueryDto } from './dto/GetCastleDetailsParamsDto'
import { getUnitGroupsController } from './unitGroup.controller'

const router = express.Router()

router.get(
  '/',
  validateRequest({ QueryDto: GetCastleDetailsQueryDto }),
  getUnitGroupsController
)

export default router
