import { Response } from 'express';
import { PostSignInDto } from './dto/PostSignInDto';
import { PostSignUpDto } from './dto/PostSignUpDto';
import { checkEmail, refreshToken, signIn, signUp } from './auth.service';
import catchAsync from '../../utils/catchAsync';
import { GetCheckEmailDto } from './dto/GetCheckEmailDto';
import { CustomRequest } from '../../types/express';
import { PostRefreshTokenDto } from './dto/PostRefreshTokenDto';

export const signInController = catchAsync(async (req: CustomRequest<false, PostSignInDto>, res: Response) => {
  res.send({ token: await signIn(req.body) });
});

export const signUpController = catchAsync(async (req: CustomRequest<false, PostSignUpDto>, res: Response) => {
  res.send({ token: await signUp(req.body) })
});

export const checkEmailController = catchAsync(async (req: CustomRequest<false, null, GetCheckEmailDto>, res: Response) => {
  res.send({ exists: await checkEmail(req.query) })
});

export const refreshTokenController = catchAsync(async (req: CustomRequest<false, PostRefreshTokenDto>, res: Response) => {
  res.send({ exists: await refreshToken(req.body) })
});

