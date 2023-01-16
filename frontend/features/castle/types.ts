import { TUser } from '../auth';
import { TUnitGroup } from '../unit';
import { TCastleResources } from '../resources';

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
  castleResources: TCastleResources
}

export type TCastleUnitGroupsExtension = {
  unitGroups: TUnitGroup[]
}

export type TCastleExtended = TCastle
  & TCastleResourcesExtension
  & TCastleUserExtension
  & TCastleUnitGroupsExtension
