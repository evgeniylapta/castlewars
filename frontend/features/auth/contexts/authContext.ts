import constate from 'constate'
import { useUserQuery } from '../query';

const useContext = () => {
  return {
    currentUserQuery: useUserQuery()
  }
}

export const [AuthProvider, useAuthContext] = constate(useContext)
