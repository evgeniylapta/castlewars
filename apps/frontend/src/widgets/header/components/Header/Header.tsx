import { FC } from 'react'
import {
  AppBar, Button, Toolbar, Typography
} from '@mui/material'
import { useRouter } from 'next/router'
import AdminActions from '../AdminActions/AdminActions'
import { logout, useIsUserAdmin } from '../../../../entities/auth'

function useLogoutHandle() {
  const { push } = useRouter()

  return async () => {
    await logout()
    push('login')
  }
}

export const Header: FC = () => (
  <AppBar position="sticky">
    <Toolbar>
      <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
        Castlewars
      </Typography>
      {useIsUserAdmin() && <AdminActions />}
      <Button onClick={useLogoutHandle()} color="inherit">Logout</Button>
    </Toolbar>
  </AppBar>
)

export default Header
