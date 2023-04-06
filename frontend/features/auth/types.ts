import { Castle } from '../castle'

export type User = {
  id: string
  name: string
  tribeTypeId: string
  castles: Castle[]
}
