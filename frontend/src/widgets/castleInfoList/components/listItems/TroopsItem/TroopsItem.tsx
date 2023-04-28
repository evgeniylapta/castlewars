import { FC } from 'react'
import { ListItem, ListItemText } from '@mui/material'
import { Units } from '../../../../../entities/unit'
import { useIsPersonalDataAvailable } from '../../../../../entities/castle/hooks/useIsPersonalDataAvailable'

export function useIsAvailable() {
  return useIsPersonalDataAvailable()
}

const TroopsItem: FC = () => (
  <ListItem>
    <ListItemText
      primary="Troops in the castle"
      secondaryTypographyProps={{
        component: 'div'
      }}
      secondary={<Units />}
    />
  </ListItem>
)

export default TroopsItem
