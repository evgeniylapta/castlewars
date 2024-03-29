import { useQuery } from 'react-query'
import { SocketAction } from '@castlewars/shared-utils'
import { apiClient, useSocketSubscribeQueryOnEvent } from '../../shared'
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
  const key = ['castles', mapRange?.minX, mapRange?.minY, mapRange?.maxX, mapRange?.maxY]

  useSocketSubscribeQueryOnEvent(SocketAction.BOTS_GENERATED, key)

  return useQuery(
    key,
    () => mapRange && castles(mapRange),
    {
      enabled: !!mapRange,
      keepPreviousData: true
    }
  )
}
