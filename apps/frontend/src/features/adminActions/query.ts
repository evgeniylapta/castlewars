import { useMutation } from 'react-query'
import { apiClient } from '../../shared'

export function useGenerateBotsMutation() {
  return useMutation(
    'generateBots',
    async () => apiClient.post('/admin/generate-bots')
  )
}
