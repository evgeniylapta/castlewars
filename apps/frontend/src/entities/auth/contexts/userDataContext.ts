import constate from 'constate'
import { useEffect } from 'react'
import { useMyUserQuery } from '../queries'
import { useSocketsContext, Uuid } from '../../../shared'

type Props = {
  allowToFetch: boolean
}

function useCurrentUserIdWatch(userId?: Uuid) {
  const { setSocketState } = useSocketsContext()

  useEffect(() => {
    setSocketState('currentUserId', userId)
  }, [userId])
}

const useContext = ({ allowToFetch }: Props) => {
  const myUserQuery = useMyUserQuery(allowToFetch)

  useCurrentUserIdWatch(myUserQuery?.data?.userId)

  return ({
    myUserQuery,
    isAuthenticated: !!myUserQuery.data
  })
}

export const [UserDataProvider, useUserDataContext] = constate(useContext)

export function useIsUserAdmin() {
  return useUserDataContext().myUserQuery?.data?.role === 'ADMIN'
}
