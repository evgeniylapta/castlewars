import constate from 'constate'
import { useMuUserQuery } from '../queries'

type Props = {
  allowToFetch: boolean
}
const useContext = ({ allowToFetch }: Props) => ({
  muUserQuery: useMuUserQuery(allowToFetch)
})

export const [
  UserDataProvider,
  useUserDataContext
] = constate(useContext)

export function useIsUserAdmin() {
  return useUserDataContext().muUserQuery?.data?.role === 'ADMIN'
}
