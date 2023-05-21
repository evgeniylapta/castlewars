import { useQuery } from 'react-query'
import { SocketAction } from 'sharedUtils'
import { apiClient } from '../../shared/apiClient'
import { Attack } from './types'
import { useSocketSubscribeQueryOnEvent } from '../../shared/hooks/useSocketSubscribeQueryOnEvent'
import { PossibleUndefined, Uuid } from '../../shared/types'

export function useAttacksListQuery(castleId: PossibleUndefined<Uuid>) {
  const key = ['attacksList', castleId]
  useSocketSubscribeQueryOnEvent(SocketAction.ATTACKS_CHANGE, key)

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
