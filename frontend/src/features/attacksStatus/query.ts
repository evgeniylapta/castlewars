import { useQuery } from 'react-query'
import { SocketAction } from 'sharedutils'
import { apiClient } from '../../shared/apiClient'
import { Attack } from './types'
import { Castle } from '../../commonTypes'
import { socketSubscribeOnEvent } from '../../shared/hooks/socketSubscribeOnEvent'

export function useAttacksListQuery(castleId?: Castle['id']) {
  const key = ['attacksList', castleId]
  socketSubscribeOnEvent(SocketAction.ATTACK_PROCESSING, key)

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
