import { useIsCurrentUserCastleSelected } from './useIsCurrentUserCastleSelected'

export function useIsPersonalDataAvailable() {
  const isSuperAdmin = true
  // const isSuperAdmin = false

  return useIsCurrentUserCastleSelected() || isSuperAdmin
}
