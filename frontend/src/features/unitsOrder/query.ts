import { useMutation, useQuery } from 'react-query'
import { apiClient } from '../../shared/apiClient'
import { OrderUnitsFormData } from './types'
import { Uuid } from '../../shared/types'
import { useCastleContext } from '../../entities/castle'

function prepareData(castleId: Uuid, data: OrderUnitsFormData) {
  return {
    castleId,
    items: Object.entries(data).filter(([, amount]) => !!amount).map((([unitTypeId, amount]) => ({
      unitTypeId,
      amount: Number(amount)
    })))
  }
}

export function useUnitsOrderMutation() {
  return useMutation<void, undefined, {castleId: Uuid, data: OrderUnitsFormData}>(
    'unitsOrder',
    async ({ data, castleId }) => (
      apiClient.post('/unit-order/create', prepareData(castleId, data))
    )
  )
}

export function useUnitsOrderQuery() {
  const { selectedCastleQuery: { data: castle } } = useCastleContext()
  const key = ['unitsOrder', castle?.id]

  return useQuery(
    key,
    async () => {
      const { data } = await apiClient.get('/unit-group', {
        params: { castleId: castle?.id }
      })

      return data
    },
    {
      enabled: !!castle?.id,
      keepPreviousData: true
    }
  )
}
