import { useMutation } from 'react-query'
import { apiClient } from '../../shared'
import { FormData } from './types'
import { AuthTokensModel } from '../../entities/auth/types'

export function useLoginMutation() {
  return useMutation<AuthTokensModel, undefined, FormData>(
    'login',
    async (formData) => {
      const { data } = await apiClient.post('/auth/login', formData)

      return data
    }
  )
}
