import { useQuery } from 'react-query'
import { SocketAction } from 'sharedutils'
import { apiClient } from '../../shared/apiClient'
import { Uuid } from '../../shared/types'
import { UnitsOrder } from './types'
import { socketSubscribeOnEvent } from '../../shared/hooks/socketSubscribeOnEvent'

export function useUnitsOrdersQuery(castleId?: Uuid) {
  const key = ['unitsOrders', castleId]
  socketSubscribeOnEvent(SocketAction.ORDERING_PROCESSING, key)

  return useQuery(
    key,
    async () => {
      const { data } = await apiClient.get<UnitsOrder>(
        'units-order',
        {
          params: { castleId }
        }
      )

      return data
    },
    {
      enabled: !!castleId
    }
  )
}
