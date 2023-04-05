import { Castle } from '../castle'

export type User = {
  id: string
  name: string
  tribeId: string
  castles: Castle[]
}
