import constate from 'constate'
import { useUnitsOrdersQuery } from '../query'
import { useCastleContext } from '../../../entities/castle'

const useContext = () => {
  const { selectedCastleQuery: { data: selectedCastle } } = useCastleContext()

  return ({
    unitsOrdersQuery: useUnitsOrdersQuery(selectedCastle?.id)
  })
}

export const [UnitsOrderStatusContextProvider, useUnitsOrderStatusContext] = constate(useContext)
