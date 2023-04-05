import { useQuery } from 'react-query'
import { apiClient } from '../../shared/apiClient'
import { TribeItem } from './types'

const unitTypesKey = () => 'tribeTypes'

async function tribeTypes() {
  const { data } = await apiClient.get<TribeItem[]>('/dictionaries/tribe-types')

  return data
}

export function useTribeTypesQuery() {
  return useQuery(unitTypesKey(), tribeTypes)
}
