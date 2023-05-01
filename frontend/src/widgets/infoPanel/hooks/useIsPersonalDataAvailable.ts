import { useCastleContext } from '../../../entities/castle'

export function useIsPersonalDataAvailable() {
  const isSuperAdmin = true
  // const isSuperAdmin = false

  return useCastleContext().isMyCastleSelected || isSuperAdmin
}
