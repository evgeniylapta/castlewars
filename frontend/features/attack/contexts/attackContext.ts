import constate from 'constate'
import { useAttacksListQuery } from '../query';
import { useCastleDetailsContext } from '../../castle';

const useContext = () => {
  const { selectedCastleId } = useCastleDetailsContext()

  return {
    attacksListQuery: useAttacksListQuery(selectedCastleId)
  }
}

export const [AttackContextProvider, useAttackContext] = constate(useContext)
