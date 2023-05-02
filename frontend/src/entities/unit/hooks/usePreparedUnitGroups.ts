import { useMemo } from 'react'
import { useUnitTypesContext } from '../contexts/unitsContext'
import { findUnitTypeById } from '../utils/unitTypeUtils'
import { UnitGroup, UnitType } from '../../../commonTypes'

const sort = (unitGroups: UnitGroup[], unitTypes: UnitType[]) => {
  const result = [...unitGroups]

  result.sort(((first, second) => {
    const firstUnitType = findUnitTypeById(first.unitTypeId, unitTypes)
    const secondUnitType = findUnitTypeById(second.unitTypeId, unitTypes)

    if (!firstUnitType || !secondUnitType) {
      return 0
    }

    if (firstUnitType.subsequence < secondUnitType.subsequence) {
      return -1
    }
    if (firstUnitType.subsequence > secondUnitType.subsequence) {
      return 1
    }
    return 0
  }))

  return result
}

export function usePreparedUnitGroups(unitGroups?: UnitGroup[]) {
  const { unitTypesQuery: { data: unitTypes } } = useUnitTypesContext()

  return useMemo(
    () => {
      if (!unitGroups || !unitTypes) {
        return undefined
      }

      return sort(unitGroups, unitTypes).filter(({ amount }) => !!amount)
    },
    [unitGroups, unitTypes]
  )
}
