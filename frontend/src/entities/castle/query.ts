import { useQuery } from 'react-query'
import { apiClient } from '../../shared/apiClient'
import { Uuid } from '../../shared/types'
import { CastleExtended } from './types'

async function castleDetails(castleId?: Uuid) {
  const { data } = await apiClient.get<CastleExtended>('/castle/details', {
    params: { castleId }
  })

  return data
}

export function useCastleDetailsQuery(castleId?: Uuid) {
  return useQuery(
    ['castleDetails', castleId],
    () => castleDetails(castleId),
    {
      enabled: !!castleId,
      keepPreviousData: true
    }
  )
}
