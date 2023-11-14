import constate from 'constate'
import { useAttacksListQuery } from '../query'
import { useCastleContext } from '../../../entities/castle'

const useContext = () => ({
  attacksListQuery: useAttacksListQuery(useCastleContext().selectedCastleQuery.data?.id)
})

export const [AttackContextProvider, useAttackContext] = constate(useContext)
