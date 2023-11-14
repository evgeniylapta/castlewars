import { FC, useState } from 'react'
import {
  ListItem, ListItemButton, ListItemIcon, ListItemText
} from '@mui/material'
import HistoryIcon from '@mui/icons-material/History'
import { AttacksHistoryModal } from '../../../../../features/attacksHistory'
import { useIsPersonalDataAvailable } from '../../../hooks/useIsPersonalDataAvailable'

export function useIsAvailable() {
  return useIsPersonalDataAvailable()
}

const HistoryItem: FC = () => {
  const [isModalOpened, setIsModalOpen] = useState(false)

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton onClick={() => setIsModalOpen(true)}>
          <ListItemIcon>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText primary="Attacks history" />
        </ListItemButton>
      </ListItem>
      <AttacksHistoryModal
        onClose={() => setIsModalOpen(false)}
        isOpened={isModalOpened}
      />
    </>
  )
}

export default HistoryItem
