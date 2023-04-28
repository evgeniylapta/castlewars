import { useMemo } from 'react'
import { useUnitTypesContext } from '../contexts/unitsContext'
import { TribeItem } from '../../tribe'

export function useUnitTypesByTribeId(tribeId?: TribeItem['id']) {
  const { unitTypesQuery: { data: unitTypes } } = useUnitTypesContext()

  return useMemo(
    () => unitTypes?.filter(({ tribeTypeId }) => tribeTypeId === tribeId),
    [unitTypes, tribeId]
  )
}
