import express from 'express'
import { myUserController } from './user.controller'
import { auth } from '../../middlewares/auth'

const router = express.Router()

router.get('/me', auth(), myUserController)

export default router
