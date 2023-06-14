import { useQuery } from 'react-query'
import { apiClient } from '../../shared'
import { TribeItem } from './types'

async function tribeTypes() {
  const { data } = await apiClient.get<TribeItem[]>('/dictionary/tribe-types')

  return data
}

export function useTribeTypesQuery() {
  return useQuery('tribeTypes', tribeTypes)
}
