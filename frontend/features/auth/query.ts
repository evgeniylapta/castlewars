import { useQuery } from 'react-query'
import { apiClient } from '../../shared/apiClient'
import { User } from './types'

async function user() {
  const { data } = await apiClient.get<User>('/user')

  return data
}

export function useUserQuery() {
  return useQuery('user', user)
}
