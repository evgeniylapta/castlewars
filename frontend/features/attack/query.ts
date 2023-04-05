import { useMutation, useQuery } from 'react-query'
import { apiClient } from '../../shared/apiClient'
import { Castle } from '../castle'
import { Attack } from './types'

const attacksListKey = (castleId?: Castle['id']) => ['attacksList', castleId]

export function useAttacksListQuery(castleId?: Castle['id']) {
  return useQuery(
    attacksListKey(castleId),
    async () => {
      const { data } = await apiClient.get<Attack[]>('/attack', {
        params: {
          castleId
        }
      })

      return data
    },
    {
      enabled: !!castleId
    }
  )
}

export function useCreateAttackMutation() {
  return useMutation<void, undefined, { castleId: string, data: object }>(
    'createAttack',
    async ({ data, castleId }) => apiClient.post('/attack', { castleId, data })
  )
}
