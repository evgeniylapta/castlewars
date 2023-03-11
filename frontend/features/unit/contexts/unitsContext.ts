import constate from 'constate'
import { useUnitTypesQuery } from '../query'

const useContext = () => ({
  unitTypesQuery: useUnitTypesQuery()
})

export const [UnitTypesContextProvider, useUnitTypesContext] = constate(useContext)
