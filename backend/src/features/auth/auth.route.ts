import express from 'express';
import { checkEmailController, refreshTokenController, signInController, signUpController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { PostSignUpDto } from './dto/PostSignUpDto';
import { GetCheckEmailDto } from './dto/GetCheckEmailDto';
import { PostSignInDto } from './dto/PostSignInDto';
import { auth } from '../../middlewares/auth';
import { PostRefreshTokenDto } from './dto/PostRefreshTokenDto';

const router = express.Router();

router.post('/signin', validateRequest({ body: PostSignInDto }), signInController)

router.post('/signup', validateRequest({ body: PostSignUpDto }), signUpController)

router.get('/check-email', auth(), validateRequest({ query: GetCheckEmailDto }), checkEmailController)

router.post('/refresh-token', validateRequest({ body: PostRefreshTokenDto }), refreshTokenController)

export default router;
