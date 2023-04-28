import { FC } from 'react'
import { AppBar, Toolbar, Typography } from '@mui/material'

export const Header: FC = () => (
  //  todo styles
  <AppBar position="sticky" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
    <Toolbar>
      <Typography variant="h6" noWrap component="div">
        Castlewars
      </Typography>
    </Toolbar>
  </AppBar>
)

export default Header
