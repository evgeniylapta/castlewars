import { UnitTypesResponseItem } from '../types'

export function findUnitTypeById(
  unitTypeId: UnitTypesResponseItem['id'],
  unitTypes?: UnitTypesResponseItem[]
) {
  return unitTypes?.find(({ id }) => id === unitTypeId)
}
