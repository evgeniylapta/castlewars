import { UnitName } from './entities/unit/types'
import { Uuid } from './shared/types'

export type Role = 'USER' | 'ADMIN'

export type UnitType = {
  id: Uuid
  name: UnitName
  attack: number
  defence: number
  speed: number
  carryingCapacity: number
  cropConsumption: number
  subsequence: number
  tribeTypeId: Uuid
  goldPrice: number
  creatingSpeed: number,
}

export type UnitGroup = {
  id: Uuid
  unitTypeId: Uuid
  amount: number
  ownerCastleId: Uuid | null
  ownerAttackId: Uuid | null
}

export type Castle = {
  id: Uuid
  x: number
  y: number
  userId: Uuid
}

export type User = {
  id: Uuid
  name: string
  tribeTypeId: Uuid
}

export type CastleUserExtension = {
  user: User
}

export type CastleResources = {
  id: Uuid
  gold: number
  goldLastUpdate: string
  castleId: Uuid
}
