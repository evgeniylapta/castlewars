import { prisma } from '../../config/prisma';

export async function findTribeTypes() {
  return await prisma.tribeType.findMany();
}
