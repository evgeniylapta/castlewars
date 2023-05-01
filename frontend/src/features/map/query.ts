import { useQuery } from 'react-query'
import { apiClient } from '../../shared/apiClient'
import { MapRange } from './types'

async function castles({
  minX, minY, maxX, maxY
}: MapRange) {
  // todo type
  // const { data } = await apiClient.get<Castle[]>('/castle', {
  const { data } = await apiClient.get<any>('/castle', {
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
