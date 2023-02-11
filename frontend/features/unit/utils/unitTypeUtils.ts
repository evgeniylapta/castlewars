import { TUnitTypesResponseItem } from '../types';

export function findUnitType(unitTypeId: TUnitTypesResponseItem['id'], unitTypes?: TUnitTypesResponseItem[]) {
  return unitTypes?.find(({ id }) => id === unitTypeId)
}
