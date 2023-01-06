import { QueryClient, useQuery } from 'react-query';
import { apiClient } from '../../shared/apiClient';
import { TUser } from './types';

const castlesUserKey = () => 'user'

async function getUser() {
  const { data } = await apiClient.get<TUser>('/user')

  return data
}

export function useUserQuery() {
  return useQuery(castlesUserKey(), getUser);
}

// todo type
export async function prefetchAuthData(queryClient: QueryClient) {
  const key = castlesUserKey()

  await queryClient.prefetchQuery(key, getUser)

  return queryClient.getQueryData(key);
}
