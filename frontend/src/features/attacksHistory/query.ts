import { useQuery, useQueryClient } from 'react-query'
import { useEffect } from 'react'
import { PossibleUndefined, Uuid, apiClient } from '../../shared'
import { AttacksHistoryResponse } from './types'

export const attacksHistoryKey = 'attacksHistory'

export function useAttacksHistoryQuery(
  castleId: PossibleUndefined<Uuid>,
  isActive: boolean,
  page: number,
  itemsPerPage: number
) {
  const key = [attacksHistoryKey, castleId, page, itemsPerPage]

  const queryClient = useQueryClient()

  useEffect(() => {
    if (!isActive) {
      queryClient.invalidateQueries(attacksHistoryKey)
    }
  }, [isActive])

  return useQuery(
    key,
    async () => {
      const { data } = await apiClient.get<AttacksHistoryResponse>('/attack/history', {
        params: {
          castleId,
          offset: (page - 1) * itemsPerPage,
          limit: itemsPerPage
        }
      })

      return data
    },
    {
      enabled: !!castleId && isActive,
      keepPreviousData: true
    }
  )
}
