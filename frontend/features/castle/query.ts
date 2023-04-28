import { useQuery } from 'react-query'
import { apiClient } from '../../shared/apiClient'
import { MapRange } from '../map/types'
import { Castle, CastleExtended } from './types'

async function castles({
  minX, minY, maxX, maxY
}: MapRange) {
  const { data } = await apiClient.get<Castle[]>('/castle', {
    params: {
      minX, minY, maxX, maxY
    }
  })

  return data
}

export function useCastlesQuery(mapRange?: MapRange) {
  return useQuery(
    ['castles', mapRange?.minX, mapRange?.minY, mapRange?.maxX, mapRange?.maxY],
    () => mapRange && castles(mapRange),
    {
      enabled: !!mapRange,
      keepPreviousData: true
    }
  )
}

async function castleDetails(castleId?: Castle['id']) {
  const { data } = await apiClient.get<CastleExtended>('/castle/details', {
    params: { castleId }
  })

  return data
}

export function useCastleDetailsQuery(castleId?: Castle['id']) {
  return useQuery(
    ['castleDetails', castleId],
    () => castleDetails(castleId),
    {
      enabled: !!castleId,
      keepPreviousData: true
    }
  )
}
