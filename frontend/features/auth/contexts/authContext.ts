import constate from 'constate'
import { TUser } from '../types';

const useContext = () => {
  const userData: TUser = {
    userId: 1,
    userName: 'Username'
  }

  return {
    userData
  }
}

export const [AuthProvider, useAuthContext] = constate(useContext)
