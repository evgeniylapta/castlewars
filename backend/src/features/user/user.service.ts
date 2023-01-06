import { prisma } from '../../config/prisma';

export async function findCurrentUser() {
  return await prisma.user.findFirst({
    where: {
      name: 'User1'
    }
  });
}
