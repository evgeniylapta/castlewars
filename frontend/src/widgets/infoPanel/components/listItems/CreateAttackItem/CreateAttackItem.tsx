import { FC, useState } from 'react'
import {
  ListItem, ListItemButton, ListItemIcon, ListItemText
} from '@mui/material'
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'
import { CreateAttackModal } from '../../../../../features/attackCreate'
import { useInfoPanelContext } from '../../../contexts/InfoPanel'
import { useCastleContext } from '../../../../../entities/castle'

export function useIsAvailable() {
  return !useCastleContext().isMyCastleSelected
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
        onSubmitCallback={useInfoPanelContext().onAttackCreated}
        isOpened={isModalOpened}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}

export default CreateAttackItem
