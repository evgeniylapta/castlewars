import { Uuid } from '../../shared/types'

export type AttacksHistoryItem = {
  id: Uuid,
  attackHistoryId: Uuid,
  isDefence: boolean,
  unitTypeId: Uuid,
  oldAmount: number,
  newAmount: number
}

export type AttacksHistory = {
  id: Uuid,
  castleFromId: Uuid,
  castleToId: Uuid,
  attackDate: string,
  items: AttacksHistoryItem[]
}

export type AttacksHistoryResponse = {
  totalCount: number,
  items: AttacksHistory[]
}
