import { prisma } from '../../config/prisma'

export async function findTribeTypes() {
  return prisma.tribeType.findMany()
}
