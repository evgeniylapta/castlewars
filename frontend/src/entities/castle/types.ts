import {
  Castle,
  CastleResources,
  CastleUserExtension,
  UnitGroup
} from '../../commonTypes'

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
