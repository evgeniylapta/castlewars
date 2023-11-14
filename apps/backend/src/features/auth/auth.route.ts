import express from 'express'
import {
  logoutController, refreshTokenController, signInController, signUpController
} from './auth.controller'
import validateRequest from '../../middlewares/validateRequest'
import { PostSignUpDto } from './dto/PostSignUpDto'
import { PostSignInDto } from './dto/PostSignInDto'

const router = express.Router()

router.post('/login', validateRequest({ BodyDto: PostSignInDto }), signInController)

router.post('/register', validateRequest({ BodyDto: PostSignUpDto }), signUpController)

router.post('/refresh-token', refreshTokenController)

router.post('/logout', logoutController)

export default router
