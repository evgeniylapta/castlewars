import { FC, useState } from 'react'
import {
  ListItem, ListItemButton, ListItemIcon, ListItemText
} from '@mui/material'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import { useIsCurrentUserCastleSelected } from '../../../../../entities/castle/hooks/useIsCurrentUserCastleSelected'
import { UnitsOrderModal } from '../../../../../entities/unit'

export function useIsAvailable() {
  return useIsCurrentUserCastleSelected()
}

const TroopsOrderingItem: FC = () => {
  const [isModalOpened, setIsModalOpen] = useState(false)

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton onClick={() => setIsModalOpen(true)}>
          <ListItemIcon>
            <GroupAddIcon />
          </ListItemIcon>
          <ListItemText primary="Troops ordering" />
        </ListItemButton>
      </ListItem>
      <UnitsOrderModal isOpened={isModalOpened} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

export default TroopsOrderingItem
