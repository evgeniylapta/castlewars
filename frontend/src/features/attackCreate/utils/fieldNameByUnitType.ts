import { UnitTypesResponseItem } from '../../../entities/unit'

export function fieldNameByUnitType(unitType: UnitTypesResponseItem) {
  return unitType.id
}
