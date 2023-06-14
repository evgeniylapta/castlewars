import { useLayoutEffect } from 'react'
import { AxiosRequestConfig } from 'axios'
import { apiClient } from '../apiClient'
import { useTokens } from './useTokens'

function updateAuthorizationHeader(config: AxiosRequestConfig, authToken: string) {
  // eslint-disable-next-line no-param-reassign
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${authToken}`
  }
}

export function useRequestInterceptor() {
  const { accessToken } = useTokens()

  useLayoutEffect(() => {
    const interceptor = apiClient.interceptors.request.use(
      (config) => {
        if (config.headers && accessToken) {
          updateAuthorizationHeader(config, accessToken)
        }
        return config
      },
      (error) => Promise.reject(error)
    )
    return () => apiClient.interceptors.request.eject(interceptor)
  }, [accessToken])
}
