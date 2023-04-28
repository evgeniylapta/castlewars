import constate from 'constate'
import { useAttacksListQuery } from '../query'
import { useSelectedCastleDetailsContext } from '../../../entities/castle'

const useContext = () => {
  const { selectedCastleId } = useSelectedCastleDetailsContext()

  return {
    attacksListQuery: useAttacksListQuery(selectedCastleId)
  }
}

export const [AttackContextProvider, useAttackContext] = constate(useContext)
