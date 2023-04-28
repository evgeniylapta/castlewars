import constate from 'constate'
import { useUserQuery } from '../query'

const useContext = () => ({
  currentUserQuery: useUserQuery()
})

export const [AuthProvider, useAuthContext] = constate(useContext)
