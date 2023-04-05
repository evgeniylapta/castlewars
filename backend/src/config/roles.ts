import { UserRole } from '@prisma/client';
export type TUserRight = 'manageUsers'

const allRoles: Readonly<{ [key in UserRole]: TUserRight[] }> = {
  USER: [],
  ADMIN: ['manageUsers'],
};

export const roleRights = new Map(Object.entries(allRoles));
