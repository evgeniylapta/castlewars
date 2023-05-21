import { useQuery } from 'react-query'
import { SocketAction } from 'sharedUtils'
import { apiClient } from '../../shared/apiClient'
import { PossibleUndefined, Uuid } from '../../shared/types'
import { UnitsOrder } from './types'
import { useSocketSubscribeQueryOnEvent } from '../../shared/hooks/useSocketSubscribeQueryOnEvent'

export function useUnitsOrdersQuery(castleId: PossibleUndefined<Uuid>) {
  const key = ['unitsOrders', castleId]
  useSocketSubscribeQueryOnEvent(SocketAction.UNITS_ORDERING_CHANGE, key)

  return useQuery(
    key,
    async () => {
      const { data } = await apiClient.get<UnitsOrder>(
        'unit-order',
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
