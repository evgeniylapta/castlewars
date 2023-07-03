import { Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import httpStatus from 'http-status'
import { PostSignInDto } from './dto/PostSignInDto'
import { PostSignUpDto } from './dto/PostSignUpDto'
import {
  logout, performRefreshToken, signIn, signUp
} from './auth.service'
import catchAsync from '../../utils/catchAsync'
import { CustomRequest } from '../../types/express'
import { setTokensHeaders } from '../token/token.service'
import { getCookieFromRequest } from '../../utils/cookies'
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '../../config/tokens'
import ApiError from '../../utils/ApiError'

export const signInController = catchAsync(
  async (req: CustomRequest<false, PostSignInDto>, res: Response) => {
    const { accessToken, refreshToken } = await signIn(req.body)

    setTokensHeaders(res, accessToken, refreshToken)

    res.status(200).end()
  }
)

export const signUpController = catchAsync(
  async (req: CustomRequest<false, PostSignUpDto>, res: Response) => {
    const { accessToken, refreshToken } = await signUp(req.body)

    setTokensHeaders(res, accessToken, refreshToken)

    res.status(200).end()
  }
)

export const refreshTokenController = catchAsync(
  async (req: Request, res: Response) => {
    const refreshTokenValue = getCookieFromRequest(req, REFRESH_TOKEN_COOKIE_NAME)

    const { accessToken, refreshToken } = await performRefreshToken(refreshTokenValue)

    setTokensHeaders(res, accessToken, refreshToken)

    res.status(200).end()
  }
)

export const logoutController = catchAsync(
  async (req: Request, res: Response) => {
    const token = getCookieFromRequest(req, ACCESS_TOKEN_COOKIE_NAME)
    const jwtData = jwt.decode(token) as JwtPayload

    if (!jwtData?.userId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User not found')
    }

    await logout(jwtData.userId)

    res.clearCookie(ACCESS_TOKEN_COOKIE_NAME, { httpOnly: true })
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, { httpOnly: true })

    res.status(200).end()
  }
)
