import { useMemo } from 'react'
import { useUnitTypesContext } from '../contexts/unitsContext'
import { TTribeItem } from '../../tribe'

export function useUnitTypesByTribeId(tribeId?: TTribeItem['id']) {
  const { unitTypesQuery: { data: unitTypes } } = useUnitTypesContext()

  return useMemo(
    () => unitTypes?.filter(({ tribeTypeId }) => tribeTypeId === tribeId),
    [unitTypes, tribeId]
  )
}
