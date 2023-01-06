import { useQuery } from 'react-query';
import { apiClient } from '../../shared/apiClient';
import { TUnitTypesResponse } from './types';

const unitTypesKey = () => 'unitTypes'

async function getUnitTypes() {
  const { data } = await apiClient.get<TUnitTypesResponse>('/dictionaries/unit-types')

  return data
}

export function useUnitTypesQuery() {
  return useQuery(unitTypesKey(), () => getUnitTypes());
}
