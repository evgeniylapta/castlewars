import { useMutation } from 'react-query'
import { apiClient } from '../../shared/apiClient'

// todo
export function useUnitsOrderMutation() {
  return useMutation<void, undefined, { castleId: string, unitTypeId: string, amount: number }>(
    'orderUnits',
    async (data) => apiClient.post('/attack', data)
  )
}
