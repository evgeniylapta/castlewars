import { UserRole } from '@prisma/client'

export type UserRight = 'manageUsers'

const allRoles: Readonly<{ [key in UserRole]: UserRight[] }> = {
  USER: [],
  ADMIN: ['manageUsers']
}

export const roleRights = new Map(Object.entries(allRoles))
