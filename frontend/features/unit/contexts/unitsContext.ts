import constate from 'constate'
import { useUnitTypesQuery } from '../query';

const useContext = () => {
  return {
    unitTypesQuery: useUnitTypesQuery(),
  }
}

export const [UnitTypesContextProvider, useUnitTypesContext] = constate(useContext)
