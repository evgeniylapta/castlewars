import { UnitType } from '../../../commonTypes'

export function findUnitTypeById(
  unitTypeId: UnitType['id'],
  unitTypes?: UnitType[]
) {
  return unitTypes?.find(({ id }) => id === unitTypeId)
}
