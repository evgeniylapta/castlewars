import { useQuery } from 'react-query'
import { apiClient } from '../../shared/apiClient'
import { Attack } from './types'
import { Castle } from '../../commonTypes'

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
