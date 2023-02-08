import { UnitType } from '@prisma/client';

export type TAttackCreationData = { [key: UnitType['id']]: number }
