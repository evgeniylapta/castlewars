import { useLocalStorage } from 'react-use'
import { ACCESS_TOKEN_LOCAL_STORAGE_KEY, REFRESH_TOKEN_LOCAL_STORAGE_KEY } from '../constants/tokens'

export function useTokens() {
  const [accessToken, setAccessToken] = useLocalStorage<string>(
    ACCESS_TOKEN_LOCAL_STORAGE_KEY,
    undefined
  )
  const [, setRefreshToken] = useLocalStorage<string>(
    REFRESH_TOKEN_LOCAL_STORAGE_KEY,
    undefined
  )

  return {
    accessToken,
    setAccessToken,
    setRefreshToken
  }
}
