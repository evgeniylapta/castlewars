import bcrypt from 'bcrypt'
import httpStatus from 'http-status'
import { prisma } from '../../config/prisma'
import { PostSignInDto } from './dto/PostSignInDto'
import ApiError from '../../utils/ApiError'
import { PostSignUpDto } from './dto/PostSignUpDto'
import { GetCheckEmailDto } from './dto/GetCheckEmailDto'
import { createUser, userByEmail, userById } from '../user/user.service'
import { generateAuthTokens, removeToken, verifyToken } from '../token/token.service'
import { PostRefreshTokenDto } from './dto/PostRefreshTokenDto'

export async function signIn({ email, password }: PostSignInDto) {
  const user = await userByEmail(email)

  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!user || !passwordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email or password')
  }

  return generateAuthTokens(user)
}

export async function signUp({
  email, password, name, tribeTypeId
}: PostSignUpDto) {
  if (await prisma.user.findFirst({ where: { email } })) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already in use')
  }

  const user = await createUser(name, tribeTypeId, email, password)

  return generateAuthTokens(user)
}

export async function checkEmail({ email }: GetCheckEmailDto) {
  return !!await userByEmail(email)
}

export async function refreshToken({ refreshToken: token }: PostRefreshTokenDto) {
  try {
    const foundRefreshToken = await verifyToken(token, 'REFRESH')
    const user = await userById(foundRefreshToken.userId)
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
