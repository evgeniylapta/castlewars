import { FC, MouseEvent, useState } from 'react'
import { Button, Menu, MenuItem } from '@mui/material'
import { useIsUserAdmin } from '../../../../entities/auth'
import { useGenerateBotsMutation } from '../../query'

function useBotsGenerate(callback?: () => void) {
  const { mutateAsync } = useGenerateBotsMutation()

  return async () => {
    await mutateAsync()

    callback?.()
  }
}

export const AdminActions: FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const execBotsGenerate = useBotsGenerate(handleClose)

  if (!useIsUserAdmin()) {
    return null
  }

  return (
    <>
      <Button
        id="admin-actions-button"
        aria-controls={open ? 'admin-actions-menu' : undefined}
        aria-haspopup="true"
        color="inherit"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Admin actions
      </Button>
      <Menu
        id="admin-actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'admin-actions-button'
        }}
      >
        <MenuItem onClick={() => execBotsGenerate()}>Generate 10 bot users</MenuItem>
      </Menu>
    </>
  )
}

export default AdminActions
