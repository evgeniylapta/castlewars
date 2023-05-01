import { UnitType } from '../types'

export function findUnitTypeById(
  unitTypeId: UnitType['id'],
  unitTypes?: UnitType[]
) {
  return unitTypes?.find(({ id }) => id === unitTypeId)
}
