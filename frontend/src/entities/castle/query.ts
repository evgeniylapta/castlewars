import { useQuery } from 'react-query'
import { SocketAction } from 'sharedUtils'
import { apiClient } from '../../shared/apiClient'
import { Uuid } from '../../shared/types'
import { CastleExtended } from './types'
import { socketSubscribeOnEvent } from '../../shared/hooks/socketSubscribeOnEvent'

async function castleDetails(castleId?: Uuid) {
  const { data } = await apiClient.get<CastleExtended>('/castle/details', {
    params: { castleId }
  })

  return data
}

export function useCastleDetailsQuery(castleId?: Uuid) {
  const key = ['castleDetails', castleId]
  socketSubscribeOnEvent(SocketAction.ATTACK_PROCESSING, key)
  socketSubscribeOnEvent(SocketAction.ORDERING_PROCESSING, key)

  return useQuery(
    key,
    () => castleDetails(castleId),
    {
      enabled: !!castleId,
      keepPreviousData: true
    }
  )
}
