import { useQuery } from 'react-query'
import { apiClient } from '../../shared'
import { MapRange } from './types'
import { Castle } from '../../commonTypes'

async function castles({
  minX, minY, maxX, maxY
}: MapRange) {
  const { data } = await apiClient.get<Castle[]>('/castle/range', {
    params: {
      minX, minY, maxX, maxY
    }
  })

  return data
}

export function useCastlesQuery(mapRange: MapRange) {
  return useQuery(
    ['castles', mapRange?.minX, mapRange?.minY, mapRange?.maxX, mapRange?.maxY],
    () => mapRange && castles(mapRange),
    {
      enabled: !!mapRange,
      keepPreviousData: true
    }
  )
}
