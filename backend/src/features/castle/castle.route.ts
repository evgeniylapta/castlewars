import express from 'express'
import {
  getCastleDetailsController,
  getCastlesController
} from './castle.controller'
import validateRequest from '../../middlewares/validateRequest'
import { GetCastlesQueryDto } from './dto/GetCastlesQueryDto'
import { GetCastleDetailsQueryDto } from './dto/GetCastleDetailsQueryDto'

const router = express.Router()

router.get(
  '/',
  validateRequest({ QueryDto: GetCastlesQueryDto }),
  getCastlesController
)

router.get(
  '/details',
  validateRequest({ QueryDto: GetCastleDetailsQueryDto }),
  getCastleDetailsController
)

export default router
