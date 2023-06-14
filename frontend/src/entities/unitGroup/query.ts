import { useQuery } from 'react-query'
import { SocketAction } from 'sharedUtils'
import {
  PossibleUndefined, Uuid, apiClient, useSocketSubscribeQueryOnEvent
} from '../../shared'
import { UnitGroup } from '../../commonTypes'

export function useUnitGroupsQuery(castleId: PossibleUndefined<Uuid>) {
  const key = ['unitGroups', castleId]

  useSocketSubscribeQueryOnEvent(
    [
      SocketAction.ATTACKS_UPDATED,
      SocketAction.UNITS_ORDERING_CHANGED
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
