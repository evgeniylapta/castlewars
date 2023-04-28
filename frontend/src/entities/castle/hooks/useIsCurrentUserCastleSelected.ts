import { useAuthContext } from '../../auth'
import { useSelectedCastleDetailsContext } from '../contexts/selectedCastleDetailsContext'

export function useIsCurrentUserCastleSelected() {
  const { currentUserQuery: { data: currentUser } } = useAuthContext()
  const { castleDetailsQuery: { data: castleDetails } } = useSelectedCastleDetailsContext()
  return castleDetails?.user.id === currentUser?.id
}
