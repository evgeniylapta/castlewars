import constate from 'constate'
import { useTribeTypesQuery } from '../query';

const useContext = () => {
  return {
    tribeTypesQuery: useTribeTypesQuery(),
  }
}

export const [TribeTypesContextProvider, useTribeTypesContext] = constate(useContext)
