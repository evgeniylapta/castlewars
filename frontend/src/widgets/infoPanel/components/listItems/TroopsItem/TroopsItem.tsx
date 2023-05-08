import { FC } from 'react'
import { ListItem, ListItemText } from '@mui/material'
import { useIsPersonalDataAvailable } from '../../../hooks/useIsPersonalDataAvailable'
import { Units } from '../../../../../features/units'

export function useIsAvailable() {
  return useIsPersonalDataAvailable()
}

const TroopsItem: FC = () => (
  <ListItem>
    <ListItemText
      primary="Troops in the castle"
      secondaryTypographyProps={{ component: 'div' }}
      secondary={<Units />}
    />
  </ListItem>
)

export default TroopsItem
