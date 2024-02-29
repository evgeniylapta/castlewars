import { useQuery } from 'react-query'
import axios from 'axios'
import { apiClient, apiClientDefaultParams } from '../../shared'
import { UserData } from './types'
import { queryClient } from '../../shared/queryClient'

const myUserKey = 'myUser'

// api client without interceptors
const isolatedApiClient = axios.create(apiClientDefaultParams)

export async function refreshToken() {
  await isolatedApiClient.post('/auth/refresh-token')
}

export async function logout() {
  try {
    await isolatedApiClient.post('/auth/logout')
    await queryClient.removeQueries(myUserKey)
  } catch (error) {
    console.log('Logout failed')
  }
}

async function getUser() {
  const { data } = await apiClient.get('/user/me')

  return data
}

export function useMyUserQuery(enabled: boolean) {
  return useQuery<UserData>(
    myUserKey,
    () => getUser(),
    {
      enabled
    }
  )
}
