import express from 'express'
import {
  getCastleDetailsController,
  getCastlesController
} from './castle.controller'
import validateRequest from '../../middlewares/validateRequest'
import { GetCastleRangeQueryDto } from './dto/GetCastleRangeQueryDto'
import { GetCastleDetailsParamsDto } from './dto/GetCastleDetailsParamsDto'
import { auth } from '../../middlewares/auth'

const router = express.Router()

router.get(
  '/range',
  auth(),
  validateRequest({ QueryDto: GetCastleRangeQueryDto }),
  getCastlesController
)

router.get(
  '/:castleId/details',
  auth(),
  validateRequest({ ParamsDto: GetCastleDetailsParamsDto }),
  getCastleDetailsController
)

export default router
