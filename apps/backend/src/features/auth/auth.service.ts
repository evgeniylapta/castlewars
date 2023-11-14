import bcrypt from 'bcrypt'
import httpStatus from 'http-status'
import { User } from '@prisma/client'
import { prisma } from '../../config/prisma'
import { PostSignInDto } from './dto/PostSignInDto'
import ApiError from '../../utils/ApiError'
import { PostSignUpDto } from './dto/PostSignUpDto'
import { createUser, findUserByEmail, findUserById } from '../user/user.service'
import { generateAuthTokens, removeToken, verifyToken } from '../token/token.service'

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

export async function performRefreshToken(token: string) {
  try {
    const foundRefreshToken = await verifyToken(token, 'REFRESH')
    const user = await findUserById(foundRefreshToken.userId)

    await removeToken(foundRefreshToken.token)
    return generateAuthTokens(user)
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Refresh token has expired or is invalid.')
  }
}

export async function logout(userId: string) {
  await prisma.token.deleteMany(
    {
      where: {
        type: 'REFRESH',
        userId
      }
    }
  )
}
