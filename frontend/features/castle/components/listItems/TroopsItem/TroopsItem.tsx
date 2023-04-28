import { FC } from 'react'
import { ListItem, ListItemText } from '@mui/material'
import { Units } from '../../../../unit'
import { useIsPersonalDataAvailable } from '../../../hooks/useIsPersonalDataAvailable'

export function useIsAvailable() {
  return useIsPersonalDataAvailable()
}

const TroopsItem: FC = () => (
  <ListItem>
    <ListItemText
      primary="Troops in the castle"
      secondary={<Units />}
    />
  </ListItem>
)

export default TroopsItem
