import {
  Castle,
  CastleUserExtension,
  UnitGroup,
  UnitType
} from '../../commonTypes'

export type Attack = {
  id: string,
  castleFromId: string,
  castleFrom: Castle & CastleUserExtension,
  castleToId: string,
  castleTo: Castle & CastleUserExtension,
  dateTime: string,
  unitGroups: UnitGroup[],
  isReturning: boolean
}

export type CreateAttackFormData = { [key: UnitType['id']]: string }
