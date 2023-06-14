import express from 'express'
import {
  getResourcesController
} from './resource.controller'
import validateRequest from '../../middlewares/validateRequest'
import { GetResourcesQueryDto } from './dto/GetCastleDetailsQueryDto'
import { auth } from '../../middlewares/auth'

const router = express.Router()

router.get(
  '/',
  auth(),
  validateRequest({ QueryDto: GetResourcesQueryDto }),
  getResourcesController
)

export default router
