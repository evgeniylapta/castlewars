import { useQuery } from 'react-query'
import { apiClient } from '../../shared/apiClient'
import { Uuid } from '../../shared/types'
import { UnitsOrder } from './types'

export function useUnitsOrdersQuery(castleId?: Uuid) {
  return useQuery(
    ['unitsOrders', castleId],
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
