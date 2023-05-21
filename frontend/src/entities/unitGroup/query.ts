import { useQuery } from 'react-query'
import { SocketAction } from 'sharedUtils'
import { PossibleUndefined, Uuid } from '../../shared/types'
import { apiClient } from '../../shared/apiClient'
import { UnitGroup } from '../../commonTypes'
import {
  useSocketSubscribeQueryOnEvent
} from '../../shared/hooks/useSocketSubscribeQueryOnEvent'

export function useUnitGroupsQuery(castleId: PossibleUndefined<Uuid>) {
  const key = ['unitGroups', castleId]

  useSocketSubscribeQueryOnEvent(
    [
      SocketAction.ATTACKS_CHANGE,
      SocketAction.UNITS_ORDERING_CHANGE
    ],
    key
  )

  return useQuery(
    key,
    async () => {
      const { data } = await apiClient.get<UnitGroup[]>('/unit-group', {
        params: { castleId }
      })

      return data
    },
    {
      enabled: !!castleId,
      keepPreviousData: true
    }
  )
}
