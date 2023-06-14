import jwt from 'jsonwebtoken'
import { Castle, User } from '@prisma/client'
import { addMinutes, getUnixTime, addDays } from 'date-fns'
import { JwtPayloadType } from '../../config/passport'
import { FullTokenType } from '../../types/token'
import { prisma } from '../../config/prisma'
import { findCastlesByUserId } from '../castle/castle.service'

function getUserTokenPayload(
  {
    id, name, tribeTypeId, role
  }: User,
  castles: Castle[]
) {
  return {
    userId: id,
    name,
    tribeTypeId,
    role,
    castleId: castles[0].id
  }
}

const generateToken = (
  data: ReturnType<typeof getUserTokenPayload>,
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

function getAccessTokenError() {
  return new Error('ACCESS token can not be saved in DB')
}

const saveToken = async (
  token: string,
  userId: string,
  expires: Date,
  type: FullTokenType,
  blacklisted = false
) => {
  if (type === 'ACCESS') {
    throw getAccessTokenError()
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
    throw getAccessTokenError()
  }

  const tokenDoc = await prisma.token.findFirst({
    where: {
      token,
      // todo is it required?
      type,
      userId: payload.userId,
      blacklisted: false
    }
  })
  if (!tokenDoc) {
    throw new Error('Token not found')
  }
  return tokenDoc
}

export const removeToken = async (token: string) => prisma.token.delete({
  where: {
    token
  }
})

export const generateAuthTokens = async (user: User) => {
  const castles = await findCastlesByUserId(user.id)

  const accessTokenExpires = addMinutes(
    new Date(),
    Number(process.env.JWT_ACCESS_EXPIRATION_MINUTES)
  )
  const accessToken = generateToken(getUserTokenPayload(user, castles), accessTokenExpires, 'ACCESS')

  const refreshTokenExpires = addDays(new Date(), Number(process.env.JWT_ACCESS_EXPIRATION_MINUTES))
  const refreshToken = generateToken(getUserTokenPayload(user, castles), refreshTokenExpires, 'REFRESH')
  await saveToken(refreshToken, user.id, refreshTokenExpires, 'REFRESH')

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toString()
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toString()
    }
  }
}

// export async function removeUserTokens(user: User) {
// const foundUser = await prisma.user.findUnique({
//   where: { id: user.id },
//   include: { tokens: true }
// })

// foundUser.tokens.forEach(() => {
//
// })
// }

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
//
// const generateVerifyEmailToken = async (user) => {
//   const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
//   const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);
//   await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
//   return verifyEmailToken;
// };
