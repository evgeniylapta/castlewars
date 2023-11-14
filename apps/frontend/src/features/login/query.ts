import { useMutation } from 'react-query'
import { apiClient } from '../../shared'
import { FormData } from './types'
import { UserData } from '../../entities/auth/types'
import { useUserDataContext } from '../../entities/auth'

export function useLoginMutation() {
  const { muUserQuery: { refetch } } = useUserDataContext()

  return useMutation<UserData, undefined, FormData>(
    'login',
    async (formData) => {
      const { data } = await apiClient.post('/auth/login', formData)

      await refetch()

      return data
    }
  )
}
