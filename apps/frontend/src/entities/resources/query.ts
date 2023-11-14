import { useQuery } from 'react-query'
import { SocketAction } from '@castlewars/shared-utils'
import {
  PossibleUndefined, Uuid, apiClient, useSocketSubscribeQueryOnEvent
} from '../../shared'

export function useResourcesQuery(castleId: PossibleUndefined<Uuid>) {
  const key = ['resources', castleId]

  useSocketSubscribeQueryOnEvent(SocketAction.RESOURCES_CHANGED, key)

  return useQuery(
    key,
    async () => {
      const { data } = await apiClient.get('/resource', {
        params: { castleId }
      })

      return data
    },
    {
      enabled: !!castleId,
      keepPreviousData: true
    }
  )
}
