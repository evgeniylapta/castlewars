import { TUser } from '../auth';
import { TUnitGroup } from '../unit';

export type TCastle = {
  id: string
  x: number
  y: number
  userId: string
}

export type TCastleUserExtension = {
  user: TUser
}

export type TCastleResourcesExtension = {
  castleResources: {
    id: string
    gold: number
    castleId: string
  }
}

export type TCastleUnitGroupsExtension = {
  unitGroups: TUnitGroup[]
}

export type TCastleExtended = TCastle
  & TCastleResourcesExtension
  & TCastleUserExtension
  & TCastleUnitGroupsExtension
