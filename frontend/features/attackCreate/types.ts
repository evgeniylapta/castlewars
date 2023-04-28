import { UnitGroup, UnitTypesResponseItem } from '../unit'
import { Castle, CastleUserExtension } from '../castle'

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

export type CreateAttackFormData = { [key: UnitTypesResponseItem['id']]: string }
