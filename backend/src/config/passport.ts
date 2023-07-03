import { Strategy as JwtStrategy } from 'passport-jwt'
import { prisma } from './prisma'
import { FullTokenType } from '../types/token'
import { ACCESS_TOKEN_COOKIE_NAME } from './tokens'

const cookieExtractor = (req) => {
  let token = null
  if (req && req.cookies) token = req.cookies[ACCESS_TOKEN_COOKIE_NAME]
  return token
}

const jwtOptions = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: cookieExtractor
}

export type JwtPayloadType = {
  type: FullTokenType
  userId: string
  exp: number
  iat: number
}

const jwtVerify = async (payload: JwtPayloadType, done) => {
  try {
    if (payload.type !== 'ACCESS') {
      throw new Error('Invalid token type')
    }

    const user = await prisma.user.findFirst({ where: { id: payload.userId } })
    if (!user) {
      return done(null, false)
    }
    return done(null, user)
  } catch (error) {
    return done(error, false)
  }
}

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify)
