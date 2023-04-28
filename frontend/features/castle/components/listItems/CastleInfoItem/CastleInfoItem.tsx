import { FC } from 'react'
import { ListItem, ListItemText } from '@mui/material'
import CastleDetails from '../../CastleDetails/CastleDetails'

export function useIsAvailable() {
  return true
}

const CastleInfoItem: FC = () => (
  <ListItem>
    <ListItemText
      primary="Selected castle info"
      secondary={<CastleDetails />}
    />
  </ListItem>
)

export default CastleInfoItem
