import jwtDecode from 'jwt-decode'
import { useTokens } from '../../../shared'
import { AuthData } from '../types'

export function useAuthData() {
  const { accessToken } = useTokens()

  return accessToken ? jwtDecode<AuthData>(accessToken) : undefined
}
