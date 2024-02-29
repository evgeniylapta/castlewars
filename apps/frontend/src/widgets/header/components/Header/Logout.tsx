import { FC } from 'react'
import { Button } from '@mui/material'
import { useRouter } from 'next/router'
import { logout, useUserDataContext } from '../../../../entities/auth'

function useLogoutHandle() {
  const { push } = useRouter()

  return async () => {
    await logout()
    push('login')
  }
}

export const Logout: FC = () => {
  const { isAuthenticated } = useUserDataContext()

  const handler = useLogoutHandle()

  if (!isAuthenticated) {
    return null
  }

  return (
    <Button onClick={handler} color="inherit">Logout</Button>
  )
}

export default Logout
