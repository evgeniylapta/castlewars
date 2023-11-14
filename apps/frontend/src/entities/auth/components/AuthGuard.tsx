import {
  FC, PropsWithChildren
} from 'react'
import { PossibleUndefined } from '../../../shared'
import { useUserDataContext } from '../contexts/authContext'

const AuthGuard: FC<PropsWithChildren & { onlyAuthenticated: PossibleUndefined<boolean> }> = ({
  onlyAuthenticated,
  children
}) => {
  const { muUserQuery: { data } } = useUserDataContext()

  return !onlyAuthenticated || data
    ? <>{children}</>
    : !data
      ? <>Loading...</>
      : null
}

export default AuthGuard
