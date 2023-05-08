import { useMutation } from 'react-query'
import { apiClient } from '../../shared/apiClient'
import { OrderUnitsFormData } from './types'
import { Uuid } from '../../shared/types'

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
      apiClient.post('/units-order/create', prepareData(castleId, data))
    )
  )
}
