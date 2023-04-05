import { prisma } from '../../config/prisma'

export async function tribeTypes() {
  return prisma.tribeType.findMany()
}
