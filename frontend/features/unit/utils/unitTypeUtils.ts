import { TUnitTypesResponseItem } from '../types';

export function findUnitTypeById(unitTypeId: TUnitTypesResponseItem['id'], unitTypes?: TUnitTypesResponseItem[]) {
  return unitTypes?.find(({ id }) => id === unitTypeId)
}
