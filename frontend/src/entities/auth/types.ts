import { Uuid } from '../../shared'
import { Role } from '../../commonTypes'

export type AuthTokensModel = {
  token: {
    access: {
      token: string,
      expires: string
    },
    refresh: {
      token: string,
      expires: string
    }
  }
}

export type AuthData = {
  castleId: Uuid
  tribeTypeId: Uuid
  userId: Uuid
  role: Role
}
