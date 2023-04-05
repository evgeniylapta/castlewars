import { useMemo } from 'react'
import { useUnitTypesContext } from '../contexts/unitsContext'
import { UnitTypesResponseItem } from '../types'

export function useUnitTypeName(unitTypeId: UnitTypesResponseItem['id']) {
  const { unitTypesQuery: { data: unitTypes } } = useUnitTypesContext()

  return useMemo(
    () => unitTypes?.find(({ id }) => id === unitTypeId)?.name,
    [unitTypes, unitTypeId]
  )
}
