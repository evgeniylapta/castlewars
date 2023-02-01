import { prisma } from '../../config/prisma';
import { TribeType } from '@prisma/client';

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

export async function createUser(name: string, tribeId: TribeType['id']) {
  return await prisma.user.create({
    include: {
      castles: true
    },
    data: {
      name,
      tribeId
    }
  });
}
