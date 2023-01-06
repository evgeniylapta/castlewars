import constate from 'constate'
import { TUser } from '../types';

const useContext = () => {
  const userData: TUser = {
    id: 'a54e7593-0aa1-4a7c-a8df-6b44cdfab190',
    name: 'User1',
    tribeId: '591a413b-829e-4e92-a775-bdf620548710',
  }

  return {
    userData
  }
}

export const [AuthProvider, useAuthContext] = constate(useContext)
