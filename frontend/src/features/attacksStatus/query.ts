import { useQuery } from 'react-query'
import { SocketAction } from 'sharedUtils'
import {
  apiClient, useSocketSubscribeQueryOnEvent, PossibleUndefined, Uuid
} from '../../shared'
import { Attack } from './types'

export function useAttacksListQuery(castleId: PossibleUndefined<Uuid>) {
  const key = ['attacksList', castleId]
  useSocketSubscribeQueryOnEvent(SocketAction.ATTACKS_UPDATED, key)

  return useQuery(
    key,
    async () => {
      const { data } = await apiClient.get<Attack[]>('/attack', {
        params: {
          castleId
        }
      })

      return data
    },
    {
      enabled: !!castleId
    }
  )
}
