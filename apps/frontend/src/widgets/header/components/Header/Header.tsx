import { FC } from 'react'
import {
  AppBar, Button, Toolbar, Typography
} from '@mui/material'
import { AdminActions } from '../../../../features/adminActions'
import Logout from './Logout'

export const Header: FC = () => (
  <AppBar position="sticky">
    <Toolbar>
      <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
        Castlewars
      </Typography>
      <AdminActions />
      <Logout />
    </Toolbar>
  </AppBar>
)

export default Header
