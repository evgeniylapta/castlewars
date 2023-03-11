import { TUnitGroup } from '../unit'
import { TCastle, TCastleUserExtension } from '../castle'

export type TAttack = {
  id: string,
  castleFromId: string,
  castleFrom: TCastle & TCastleUserExtension,
  castleToId: string,
  castleTo: TCastle & TCastleUserExtension,
  dateTime: string,
  unitGroups: TUnitGroup[],
  isReturning: boolean
}
