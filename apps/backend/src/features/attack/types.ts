import { UnitType } from '@prisma/client'

export type AttackCreationData = { [key: UnitType['id']]: number }
