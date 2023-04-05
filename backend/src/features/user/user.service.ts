import { prisma } from '../../config/prisma';
import { TribeType, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

export async function findCurrentUser() {
  return await prisma.user.findFirst({
    where: {
      name: 'TestUser'
    },
    include: {
      castles: true
    }
  });
}

// todo optimize to aggregated
export async function selectBotsAmount() {
  return (await prisma.user.findMany({
    where: {
      isBot: true
    }
  })).length;
}

export async function createUser(name: string, tribeId: TribeType['id'], email: string, password: string, role: UserRole = 'USER') {
  return await prisma.user.create({
    include: {
      castles: true
    },
    data: {
      name,
      tribeId,
      email,
      role,
      password: await encryptPassword(password)
    }
  });
}

export async function userByEmail(email: string) {
  return await prisma.user.findFirst({ where: { email } })
}

export async function userById(id: string) {
  return await prisma.user.findUnique({ where: { id } })
}

export async function encryptPassword(password: string) {
  return bcrypt.hash(password, 10)
}
