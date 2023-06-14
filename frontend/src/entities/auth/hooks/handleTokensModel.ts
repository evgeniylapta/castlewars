import { AuthTokensModel } from '../types'
import { useTokens } from '../../../shared'

export function useTokensModelHandle() {
  const { setRefreshToken, setAccessToken } = useTokens()

  return ({ token: { access, refresh } }: AuthTokensModel) => {
    setAccessToken(access.token)
    setRefreshToken(refresh.token)
  }
}
