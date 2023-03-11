import { TCastle } from '../castle'

export type TUser = {
  id: string
  name: string
  tribeId: string
  castles: TCastle[]
}
