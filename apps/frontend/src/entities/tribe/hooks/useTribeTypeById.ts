import { useMemo } from 'react'
import { TribeItem, useTribeTypesContext } from '../index'

export function useTribeTypeById(tribeTypeId?: TribeItem['id']) {
  const { tribeTypesQuery: { data } } = useTribeTypesContext()

  return useMemo(
    () => data?.find(({ id }) => id === tribeTypeId)?.name,
    [data, tribeTypeId]
  )
}
