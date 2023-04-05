import { useQuery } from 'react-query'
import { apiClient } from '../../shared/apiClient'
import { MapRange } from '../map/types'
import { Castle, CastleExtended } from './types'

const myCastleKey = () => 'myCastle'
const castlesKey = (mapRange?: MapRange) => ['castles', mapRange?.minX, mapRange?.minY, mapRange?.maxX, mapRange?.maxY]
const castleDetailsKey = (castleId?: Castle['id']) => ['castleDetails', castleId]
const castlesDistanceKey = (castleFromId?: Castle['id'], castleToId?: Castle['id']) => ['castlesDistance', castleFromId, castleToId]

async function myCastle() {
  const { data } = await apiClient.get<Castle>('/castle/my')

  return data
}

// todo remove
export function useMyCastleQuery() {
  return useQuery(myCastleKey(), myCastle)
}

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
    castlesKey(mapRange),
    () => mapRange && castles(mapRange),
    {
      enabled: !!mapRange,
      keepPreviousData: true
    }
  )
}

async function castleDetails(castleId?: Castle['id']) {
  const { data } = await apiClient.get<CastleExtended>('/castle/details', {
    params: {
      castleId
    }
  })

  return data
}

export function useCastleDetailsQuery(castleId?: Castle['id']) {
  return useQuery(
    castleDetailsKey(castleId),
    () => castleDetails(castleId),
    {
      enabled: !!castleId
    }
  )
}

export function useCastlesDistanceQuery(castleFromId?: Castle['id'], castleToId?: Castle['id']) {
  return useQuery(
    castlesDistanceKey(castleFromId, castleToId),
    async () => {
      const { data } = await apiClient.get<any>('/castle/distance', {
        params: {
          castleFromId,
          castleToId
        }
      })

      return data
    },
    {
      enabled: !!castleFromId && !!castleToId
    }
  )
}

// export async function prefetchCastlesData(queryClient: QueryClient) {
//   return await queryClient.prefetchQuery(castlesGetKey(), getCastles);
// }
