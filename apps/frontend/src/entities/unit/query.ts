import { useQuery } from 'react-query'
import { apiClient } from '../../shared'
import { UnitType } from '../../commonTypes'

async function unitTypes() {
  const { data } = await apiClient.get<UnitType[]>('/dictionary/unit-types')

  return data
}

export function useUnitTypesQuery() {
  return useQuery('unitTypes', unitTypes)
}
