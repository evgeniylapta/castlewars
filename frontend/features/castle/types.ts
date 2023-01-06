import { TUser } from '../auth';

export type TUnitGroup = {
  id: string
  unitTypeId: string
  amount: number
  ownerCastleId: string | null
  ownerAttackId: string | null
}

export type TCastle = {
  id: number
  x: number
  y: number
  userId: number
}

export type TCastleExtended = TCastle & {
  castleResources: {
    id: string
    gold: number
    castleId: string
  },
  unitGroups: TUnitGroup[],
  user: TUser
}
