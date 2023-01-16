import { useUnitTypesContext } from '../contexts/unitsContext';
import { useMemo } from 'react';
import { TUnitGroup } from '../types';

export function useUnitTypeName(unitGroup: TUnitGroup) {
  const { unitTypesQuery: { data: unitTypes } } = useUnitTypesContext()

  return useMemo(
    () => unitTypes?.find(({ id }) => id === unitGroup?.unitTypeId)?.name,
    [unitTypes, unitGroup]
  )
}
