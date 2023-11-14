import { Uuid } from '../../shared'

export type FormData = {
  email: string
  password: string
  tribeTypeId: Uuid
  userName: string
  passwordRepeat: string
}
