import constate from 'constate'
import { useTribeTypesQuery } from '../query'

const useContext = () => ({
  tribeTypesQuery: useTribeTypesQuery()
})

export const [TribeTypesContextProvider, useTribeTypesContext] = constate(useContext)
