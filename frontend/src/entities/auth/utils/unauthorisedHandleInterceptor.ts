/* eslint-disable no-underscore-dangle,no-param-reassign */
import axios, { AxiosError } from 'axios'
import { apiClient, publishCustomEvent } from '../../../shared'
import { refreshToken, logout } from '../queries'

export const REFRESH_TOKEN_FAILED_EVENT_NAME = 'refresh-token-failed'

const unauthorisedHandle = async ({ response, config }: AxiosError) => {
  // @ts-ignore
  if (response && response.status === 401 && !config._retry) {
    // @ts-ignore
    config._retry = true

    try {
      await refreshToken()

      // @ts-ignore
      return axios(config)
    } catch {
      await logout()
      publishCustomEvent(REFRESH_TOKEN_FAILED_EVENT_NAME)
    }
  }

  return undefined
}

export function unauthorisedInterceptorInit() {
  apiClient.interceptors.response.use(
    (res) => res,
    async (err: AxiosError) => {
      if (axios.isAxiosError(err)) {
        return unauthorisedHandle(err)
      }

      return undefined
    }
  )
}
