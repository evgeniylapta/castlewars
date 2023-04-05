import express from 'express'
import { userController } from './user.controller'

const router = express.Router()

router
  .route('/')
  .get(userController)

export default router
