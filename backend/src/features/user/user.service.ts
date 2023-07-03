import { TribeType, UserRole } from '@prisma/client'
import bcrypt from 'bcrypt'
import { prisma } from '../../config/prisma'
import { generateUser } from '../generation/services/generation.service'

// todo optimize to aggregated
export async function findBotsAmount() {
  return (await prisma.user.findMany({
    where: {
      isBot: true
    }
  })).length
}

export async function encryptPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function createUser(
  name: string,
  tribeId: TribeType['id'],
  email: string,
  password: string,
  role: UserRole = 'USER'
) {
  return generateUser(name, email, password, role, tribeId)
}

export async function findUserByEmail(email: string) {
  return prisma.user.findFirst({ where: { email } })
}

export async function findUserById(id: string, withCastles = false) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      castles: withCastles
    }
  })
}
