import {
  FC, PropsWithChildren
} from 'react'
import { PossibleUndefined } from '../../../shared'
import { useUserDataContext } from '../contexts/userDataContext'

const AuthGuard: FC<PropsWithChildren & { onlyAuthenticated: PossibleUndefined<boolean> }> = ({
  onlyAuthenticated,
  children
}) => {
  const { myUserQuery: { data } } = useUserDataContext()

  return !onlyAuthenticated || data
    ? <>{children}</>
    : !data
      ? <>Loading...</>
      : null
}

export default AuthGuard
