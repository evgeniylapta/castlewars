import { useMemo } from 'react';
import { TTribeItem, useTribeTypesContext } from '../index';

export function useTribeTypeById(tribeTypeId?: TTribeItem['id'], ) {
  const { tribeTypesQuery: { data } } = useTribeTypesContext()

  return useMemo(
    () => data?.find(({ id }) => id === tribeTypeId)?.name,
    [data, tribeTypeId]
  )
}
