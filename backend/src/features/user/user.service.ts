import { TribeType, UserRole } from '@prisma/client'
import bcrypt from 'bcrypt'
import { prisma } from '../../config/prisma'

export async function currentUser() {
  return prisma.user.findFirst({
    where: {
      name: 'TestUser'
    },
    include: {
      castles: true
    }
  })
}

// todo optimize to aggregated
export async function selectBotsAmount() {
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
  return prisma.user.create({
    include: {
      castles: true
    },
    data: {
      name,
      tribeTypeId: tribeId,
      email,
      role,
      password: await encryptPassword(password)
    }
  })
}

export async function userByEmail(email: string) {
  return prisma.user.findFirst({ where: { email } })
}

export async function userById(id: string) {
  return prisma.user.findUnique({ where: { id } })
}
