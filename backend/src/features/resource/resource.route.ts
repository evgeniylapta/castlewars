import express from 'express'
import {
  getResourcesController
} from './resource.controller'
import validateRequest from '../../middlewares/validateRequest'
import { GetResourcesQueryDto } from './dto/GetCastleDetailsQueryDto'

const router = express.Router()

router.get(
  '/',
  validateRequest({ QueryDto: GetResourcesQueryDto }),
  getResourcesController
)

export default router
