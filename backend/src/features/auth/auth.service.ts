import bcrypt from 'bcrypt'
import httpStatus from 'http-status'
import { User } from '@prisma/client'
import { prisma } from '../../config/prisma'
import { PostSignInDto } from './dto/PostSignInDto'
import ApiError from '../../utils/ApiError'
import { PostSignUpDto } from './dto/PostSignUpDto'
import { GetCheckEmailDto } from './dto/GetCheckEmailDto'
import { createUser, findUserByEmail, findUserById } from '../user/user.service'
import { generateAuthTokens, removeToken, verifyToken } from '../token/token.service'
import { PostRefreshTokenDto } from './dto/PostRefreshTokenDto'

async function isPasswordMatch(user: User, password: string) {
  return bcrypt.compare(password, user.password)
}

export async function signIn({ email, password }: PostSignInDto) {
  const user = await findUserByEmail(email)

  if (!user || !await isPasswordMatch(user, password)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email or password')
  }

  return generateAuthTokens(user)
}

export async function signUp({
  email, password, userName, tribeTypeId
}: PostSignUpDto) {
  if (await prisma.user.findFirst({ where: { email } })) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already in use')
  }

  const user = await createUser(userName, tribeTypeId, email, password)

  return generateAuthTokens(user)
}

export async function checkEmail({ email }: GetCheckEmailDto) {
  return !!await findUserByEmail(email)
}

export async function refreshToken({ refreshToken: token }: PostRefreshTokenDto) {
  try {
    const foundRefreshToken = await verifyToken(token, 'REFRESH')
    const user = await findUserById(foundRefreshToken.userId)
    if (!user) {
      // todo error?
      throw new Error()
    }
    await removeToken(foundRefreshToken.token)
    return generateAuthTokens(user)
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate')
  }
}

// export function logout (refreshToken) {
//   const refreshTokenDoc = await Token.findOne(
//     { token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false }
//   );
//   if (!refreshTokenDoc) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
//   }
//   await refreshTokenDoc.remove();
// }
