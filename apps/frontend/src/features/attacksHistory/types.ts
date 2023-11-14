import { Uuid } from '../../shared'
import { Castle } from '../../commonTypes'

export type AttacksHistoryItem = {
  id: Uuid,
  attackHistoryId: Uuid,
  isDefence: boolean,
  unitTypeId: Uuid,
  oldAmount: number,
  newAmount: number
}

type AttacksHistoryCastle = Castle & {
  user: {
    id: Uuid
    name: string
  }
}

export type AttacksHistory = {
  id: Uuid,
  castleFrom: AttacksHistoryCastle,
  castleTo: AttacksHistoryCastle,
  attackDate: string,
  items: AttacksHistoryItem[]
}

export type AttacksHistoryResponse = {
  totalCount: number,
  items: AttacksHistory[]
}
