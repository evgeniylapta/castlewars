import { UserRole } from '@prisma/client'

export type UserRight = 'generateBots'

const allRoles: Readonly<{ [key in UserRole]: UserRight[] }> = {
  USER: [],
  ADMIN: ['generateBots']
}

export const roleRights = new Map(Object.entries(allRoles))
