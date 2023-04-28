import { FC } from 'react'
import {
  ListItem, ListItemButton, ListItemIcon, ListItemText
} from '@mui/material'
import HistoryIcon from '@mui/icons-material/History'

export function useIsAvailable() {
  // return useIsPersonalDataAvailable()
  return false
}

const HistoryItem: FC = () => (
  <ListItem disablePadding>
    {/* todo modal */}
    <ListItemButton onClick={() => {}}>
      <ListItemIcon>
        <HistoryIcon />
      </ListItemIcon>
      <ListItemText primary="Attacks history" />
    </ListItemButton>
  </ListItem>
)

export default HistoryItem
