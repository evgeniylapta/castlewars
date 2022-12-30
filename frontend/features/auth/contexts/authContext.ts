import constate from 'constate'

const useContext = () => {
  return {
    currentUserId: 1
  }
}

export const [AuthProvider, useAuthContext] = constate(useContext)
