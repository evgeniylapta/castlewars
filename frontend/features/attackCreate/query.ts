import { useMutation } from 'react-query'
import { apiClient } from '../../shared/apiClient'

export function useCreateAttackMutation() {
  return useMutation<void, undefined, { castleId: string, data: object }>(
    'createAttack',
    async ({ data, castleId }) => apiClient.post('/attack', { castleId, data })
  )
}
