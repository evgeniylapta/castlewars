import { UnitGroup, UnitTypesResponseItem } from '../../entities/unit'
import { Castle, CastleUserExtension } from '../../entities/castle'

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
