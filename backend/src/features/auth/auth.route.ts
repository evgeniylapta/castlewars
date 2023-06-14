import express from 'express'
import {
  checkEmailController, refreshTokenController, signInController, signUpController
} from './auth.controller'
import validateRequest from '../../middlewares/validateRequest'
import { PostSignUpDto } from './dto/PostSignUpDto'
import { GetCheckEmailDto } from './dto/GetCheckEmailDto'
import { PostSignInDto } from './dto/PostSignInDto'
import { PostRefreshTokenDto } from './dto/PostRefreshTokenDto'

const router = express.Router()

router.post('/login', validateRequest({ BodyDto: PostSignInDto }), signInController)

router.post('/register', validateRequest({ BodyDto: PostSignUpDto }), signUpController)

router.get('/check-email', validateRequest({ QueryDto: GetCheckEmailDto }), checkEmailController)

router.post('/refresh-token', validateRequest({ BodyDto: PostRefreshTokenDto }), refreshTokenController)

export default router
