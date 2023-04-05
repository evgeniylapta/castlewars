import express from 'express'
import {
  createCastleController,
  castleDetails,
  castlesController,
  currentUserCastleController,
  distanceBetweenCastlesController
} from './castle.controller'
import validateRequest from '../../middlewares/validateRequest'
import { CastleCreateDto } from './dto/CastleCreateDto'
import { GetCastlesQueryDto } from './dto/GetCastlesQueryDto'
import { GetCastleDetailsQueryDto } from './dto/GetCastleDetailsQueryDto'
import { GetDistanceBetweenCastlesQueryDto } from './dto/GetDistanceBetweenPointsQueryDto'

const router = express.Router()

router.route('/')
  .get(validateRequest({ QueryDto: GetCastlesQueryDto }), castlesController)
  .post(validateRequest({ BodyDto: CastleCreateDto }), createCastleController)

router.get('/my', currentUserCastleController)

router.get(
  '/distance',
  validateRequest({ QueryDto: GetDistanceBetweenCastlesQueryDto }),
  distanceBetweenCastlesController
)

router.get(
  '/details',
  validateRequest({ QueryDto: GetCastleDetailsQueryDto }),
  castleDetails
)

export default router
