import { Uuid } from '../../shared'
import { Role } from '../../commonTypes'

export type UserData = {
  castleId: Uuid
  tribeTypeId: Uuid
  userId: Uuid
  role: Role
}
