import { useQuery } from 'react-query'
import { apiClient } from '../../shared/apiClient'
import { TUser } from './types'

async function getUser() {
  const { data } = await apiClient.get<TUser>('/user')

  return data
}

export function useUserQuery() {
  return useQuery('user', getUser)
}
