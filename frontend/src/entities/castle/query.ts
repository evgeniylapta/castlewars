import { useQuery } from 'react-query'
import { apiClient, PossibleUndefined, Uuid } from '../../shared'
import { CastleExtended } from './types'

async function castleDetails(castleId: PossibleUndefined<Uuid>) {
  const { data } = await apiClient.get<CastleExtended>(`/castle/${castleId}/details`)

  return data
}

export function useCastleDetailsQuery(castleId: PossibleUndefined<Uuid>) {
  const key = ['castleDetails', castleId]

  return useQuery(
    key,
    () => castleDetails(castleId),
    {
      enabled: !!castleId,
      keepPreviousData: true
    }
  )
}
