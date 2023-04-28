import { useMutation, useQuery } from 'react-query'
import { apiClient } from '../../shared/apiClient'
import { UnitTypesResponse } from './types'

const unitTypesKey = () => 'unitTypes'

async function unitTypes() {
  const { data } = await apiClient.get<UnitTypesResponse>('/dictionaries/unit-types')

  return data
}

export function useUnitTypesQuery() {
  return useQuery(unitTypesKey(), unitTypes)
}

export function useUnitsOrderMutation() {
  return useMutation<void, undefined, { castleId: string, unitTypeId: string, amount: number }>(
    'orderUnits',
    async (data) => apiClient.post('/attack', data)
  )
}
