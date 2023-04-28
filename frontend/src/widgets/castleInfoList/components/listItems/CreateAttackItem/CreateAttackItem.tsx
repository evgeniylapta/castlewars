import { FC, useState } from 'react'
import {
  ListItem, ListItemButton, ListItemIcon, ListItemText
} from '@mui/material'
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'
import { useIsCurrentUserCastleSelected } from '../../../../../entities/castle/hooks/useIsCurrentUserCastleSelected'
import { CreateAttackModal } from '../../../../../features/attackCreate'

export function useIsAvailable() {
  return !useIsCurrentUserCastleSelected()
}

const CreateAttackItem: FC = () => {
  const [isModalOpened, setIsModalOpen] = useState(false)

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton onClick={() => setIsModalOpen(true)}>
          <ListItemIcon>
            <DoubleArrowIcon />
          </ListItemIcon>
          <ListItemText primary="Attack the castle" />
        </ListItemButton>
      </ListItem>
      <CreateAttackModal
        isOpened={isModalOpened}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}

export default CreateAttackItem
