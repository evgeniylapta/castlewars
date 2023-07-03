import jwt from 'jsonwebtoken'
import { Response } from 'express'
import { User } from '@prisma/client'
import { addMinutes, getUnixTime, addDays } from 'date-fns'
import { JwtPayloadType } from '../../config/passport'
import { FullTokenType } from '../../types/token'
import { prisma } from '../../config/prisma'
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '../../config/tokens'

function getTokenPayload({ id }: User) {
  return {
    userId: id
  }
}

const generateToken = (
  data: ReturnType<typeof getTokenPayload>,
  expires: Date,
  type: FullTokenType,
  secret = process.env.JWT_SECRET
) => {
  const payload: JwtPayloadType = {
    type,
    exp: getUnixTime(expires),
    iat: getUnixTime(new Date()),
    ...data
  }

  return jwt.sign(payload, secret)
}

const saveToken = async (
  token: string,
  userId: string,
  expires: Date,
  type: FullTokenType,
  blacklisted = false
) => {
  if (type === 'ACCESS') {
    throw new Error('ACCESS token can not be saved in DB')
  }

  return prisma.token.create({
    data: {
      token,
      userId,
      expires,
      type,
      blacklisted
    }
  })
}

export const verifyToken = async (token: string, type: FullTokenType) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET) as JwtPayloadType

  if (type === 'ACCESS') {
    throw new Error('Access token can not be verified')
  }

  const tokens = await prisma.token.findMany({
    where: {
      token,
      type,
      userId: payload.userId,
      blacklisted: false,
      expires: {
        gte: new Date()
      }
    }
  })

  if (!tokens.length) {
    throw new Error('Token not found')
  }

  return tokens[0]
}

export const removeToken = async (token: string) => prisma.token.deleteMany({
  where: {
    token
  }
})

export const generateAuthTokens = async (user: User) => {
  const accessTokenExpires = addMinutes(
    new Date(),
    Number(process.env.JWT_ACCESS_EXPIRATION_MINUTES)
  )

  const accessToken = generateToken(getTokenPayload(user), accessTokenExpires, 'ACCESS')

  const refreshTokenExpires = addDays(new Date(), Number(process.env.JWT_ACCESS_EXPIRATION_MINUTES))
  const refreshToken = generateToken(getTokenPayload(user), refreshTokenExpires, 'REFRESH')
  await saveToken(refreshToken, user.id, refreshTokenExpires, 'REFRESH')

  return {
    accessToken,
    refreshToken
  }
}

export async function removeUserTokens(user: User) {
  const foundUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { tokens: true }
  })

  foundUser.tokens.forEach(() => {

  })
}

export function setTokensHeaders(res: Response, accessToken, refreshToken) {
  // todo move accessToken to constant to reuse in passport strategy
  res.setHeader('Set-Cookie', [
    `${ACCESS_TOKEN_COOKIE_NAME}=${accessToken}; SameSite=None; Secure; Path=/`,
    `${REFRESH_TOKEN_COOKIE_NAME}=${refreshToken}; SameSite=None; Secure; Path=/`
  ])
}

// const generateResetPasswordToken = async (email: string) => {
//   const user = await userByEmail(email);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
//   }
//   const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
//   const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
//   await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
//   return resetPasswordToken;
// };

// const generateVerifyEmailToken = async (user) => {
//   const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes')
//   const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL)
//   await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL)
//   return verifyEmailToken
// }
