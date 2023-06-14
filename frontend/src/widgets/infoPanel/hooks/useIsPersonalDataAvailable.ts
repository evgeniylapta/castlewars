import { useCastleContext } from '../../../entities/castle'
import { useAuthData } from '../../../entities/auth'

export function useIsPersonalDataAvailable() {
  const isAdmin = useAuthData()?.role === 'ADMIN'

  return useCastleContext().isMyCastleSelected || isAdmin
}
