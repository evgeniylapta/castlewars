import { useMutation } from 'react-query'
import { apiClient } from '../../shared'
import { FormData } from './types'
import { UserData } from '../../entities/auth/types'
import { useUserDataContext } from '../../entities/auth'

export function useRegisterMutation() {
  const { myUserQuery: { refetch } } = useUserDataContext()

  return useMutation<UserData, undefined, FormData>(
    'register',
    async ({
      email, password, userName, tribeTypeId
    }) => {
      const { data } = await apiClient.post(
        '/auth/register',
        {
          email, password, userName, tribeTypeId
        }
      )

      await refetch()

      return data
    }
  )
}
