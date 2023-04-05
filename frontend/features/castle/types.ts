import { User } from '../auth'
import { UnitGroup } from '../unit'
import { CastleResources } from '../resources'

export type Castle = {
  id: string
  x: number
  y: number
  userId: string
}

export type CastleUserExtension = {
  user: User
}

export type CastleResourcesExtension = {
  castleResources: CastleResources
}

export type CastleUnitGroupsExtension = {
  unitGroups: UnitGroup[]
}

export type CastleExtended = Castle
  & CastleResourcesExtension
  & CastleUserExtension
  & CastleUnitGroupsExtension
