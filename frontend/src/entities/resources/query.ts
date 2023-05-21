import { useQuery } from 'react-query'
import { apiClient } from '../../shared/apiClient'
import { PossibleUndefined, Uuid } from '../../shared/types'

export function useResourcesQuery(castleId: PossibleUndefined<Uuid>) {
  const key = ['resources', castleId]

  return useQuery(
    key,
    async () => {
      const { data } = await apiClient.get('/resource', {
        params: { castleId }
      })

      return data
    },
    {
      enabled: !!castleId,
      keepPreviousData: true
    }
  )
}
