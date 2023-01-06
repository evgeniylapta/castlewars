import { useQuery } from 'react-query';
import { apiClient } from '../../shared/apiClient';
import { MapRange } from '../map/types';
import { TCastle, TCastleExtended } from './types';

const myCastleGetKey = () => 'myCastle'
const castlesGetKey = (mapRange?: MapRange) => ['castles', mapRange?.minX, mapRange?.minY, mapRange?.maxX, mapRange?.maxY]
const castleDetailsGetKey = (castleId?: TCastle['id']) => ['castleDetails', castleId]

async function getMyCastle() {
  const { data } = await apiClient.get<TCastle>('/castle/my')

  return data
}

export function useMyCastleQuery() {
  return useQuery(myCastleGetKey(), getMyCastle);
}

async function getCastles({ minX, minY, maxX, maxY }: MapRange) {
  const { data } = await apiClient.get<TCastle[]>('/castle', {
    params: { minX, minY, maxX, maxY }
  })

  return data
}

export function useCastlesQuery(mapRange?: MapRange) {
  return useQuery(castlesGetKey(mapRange), () => mapRange && getCastles(mapRange),
    {
      enabled: !!mapRange,
      keepPreviousData: true
    });
}


async function getCastleDetails(castleId?: TCastle['id']) {
  const { data } = await apiClient.get<TCastleExtended>('/castle/details', {
    params: {
      castleId
    }
  })

  return data
}

export function useCastleDetailsQuery(castleId?: TCastle['id']) {
  return useQuery(castleDetailsGetKey(castleId), () => getCastleDetails(castleId),
    {
      enabled: !!castleId,
      // keepPreviousData: true
    });
}

// export async function prefetchCastlesData(queryClient: QueryClient) {
//   return await queryClient.prefetchQuery(castlesGetKey(), getCastles);
// }
