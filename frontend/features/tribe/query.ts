import { useQuery } from 'react-query'
import { apiClient } from '../../shared/apiClient'
import { TTribeItem } from './types'

const unitTypesKey = () => 'tribeTypes'

async function getTribeTypes() {
  const { data } = await apiClient.get<TTribeItem[]>('/dictionaries/tribe-types')

  return data
}

export function useTribeTypesQuery() {
  return useQuery(unitTypesKey(), () => getTribeTypes())
}
