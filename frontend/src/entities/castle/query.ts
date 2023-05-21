import { useQuery } from 'react-query'
import { apiClient } from '../../shared/apiClient'
import { PossibleUndefined, Uuid } from '../../shared/types'
import { CastleExtended } from './types'

async function castleDetails(castleId: PossibleUndefined<Uuid>) {
  const { data } = await apiClient.get<CastleExtended>('/castle/details', {
    params: { castleId }
  })

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
