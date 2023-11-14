import { useMutation, useQuery } from 'react-query'
import { apiClient, Uuid } from '../../shared'
import { OrderUnitsFormData } from './types'
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
