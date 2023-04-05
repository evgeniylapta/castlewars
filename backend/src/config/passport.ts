import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { prisma } from './prisma'
import { FullTokenType } from '../types/token'

const jwtOptions = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
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
