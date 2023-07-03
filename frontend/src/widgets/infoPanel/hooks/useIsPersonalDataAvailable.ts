import { useCastleContext } from '../../../entities/castle'
import { useIsUserAdmin } from '../../../entities/auth'

export function useIsPersonalDataAvailable() {
  const isAdmin = useIsUserAdmin()

  return useCastleContext().isMyCastleSelected || isAdmin
}
