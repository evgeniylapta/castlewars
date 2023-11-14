import { useQuery } from 'react-query'
import { SocketAction } from '@castlewars/shared-utils'
import {
  apiClient, PossibleUndefined, Uuid, useSocketSubscribeQueryOnEvent
} from '../../shared'
import { UnitsOrder } from './types'

export function useUnitsOrdersQuery(castleId: PossibleUndefined<Uuid>) {
  const key = ['unitsOrders', castleId]
  useSocketSubscribeQueryOnEvent(SocketAction.UNITS_ORDERING_CHANGED, key)

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
