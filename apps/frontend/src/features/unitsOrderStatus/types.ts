import { Uuid } from '../../shared'

export type UnitsOrderItem = {
  id: Uuid,
  unitTypeId: Uuid,
  orderId: Uuid,
  amount: number,
  subsequence: number
}

export type UnitsOrder = {
  id: Uuid,
  castleId: Uuid,
  lastCreationDate: string,
  items: UnitsOrderItem[]
}
