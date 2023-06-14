import { useMutation } from 'react-query'
import { apiClient } from '../../shared'
import { FormData } from './types'
import { AuthTokensModel } from '../../entities/auth/types'

export function useRegisterMutation() {
  return useMutation<AuthTokensModel, undefined, FormData>(
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

      return data
    }
  )
}
