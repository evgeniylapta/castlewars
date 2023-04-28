import { useIsCurrentUserCastleSelected } from '../../../entities/castle'

export function useIsPersonalDataAvailable() {
  const isSuperAdmin = true
  // const isSuperAdmin = false

  return useIsCurrentUserCastleSelected() || isSuperAdmin
}
