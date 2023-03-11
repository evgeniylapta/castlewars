import { useMemo } from 'react'
import { useUnitTypesContext } from '../contexts/unitsContext'
import { TUnitTypesResponseItem } from '../types'

export function useUnitTypeName(unitTypeId: TUnitTypesResponseItem['id']) {
  const { unitTypesQuery: { data: unitTypes } } = useUnitTypesContext()

  return useMemo(
    () => unitTypes?.find(({ id }) => id === unitTypeId)?.name,
    [unitTypes, unitTypeId]
  )
}
