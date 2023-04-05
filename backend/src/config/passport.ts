import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { prisma } from './prisma';
import { TFullTokenType } from '../types/token';

const jwtOptions = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

export type TJwtPayloadType = {
  type: TFullTokenType
  userId: string
  exp: number
  iat: number
}

const jwtVerify = async (payload: TJwtPayloadType, done) => {
  try {
    if (payload.type !== 'ACCESS') {
      throw new Error('Invalid token type');
    }

    console.log('payload');
    console.log(payload);

    const user = await prisma.user.findFirst({ where: { id: payload.userId } });
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
