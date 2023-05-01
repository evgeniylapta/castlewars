import { useMemo } from 'react'
import { useUnitTypesContext } from '../contexts/unitsContext'
import { UnitType } from '../types'

export function useUnitTypeName(unitTypeId: UnitType['id']) {
  const { unitTypesQuery: { data: unitTypes } } = useUnitTypesContext()

  return useMemo(
    () => unitTypes?.find(({ id }) => id === unitTypeId)?.name,
    [unitTypes, unitTypeId]
  )
}
