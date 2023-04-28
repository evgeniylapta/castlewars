import { FC } from 'react'
import { ListItem, ListItemText } from '@mui/material'
import { Gold } from '../../../../../entities/resources'
import { useIsPersonalDataAvailable } from '../../../hooks/useIsPersonalDataAvailable'

export function useIsAvailable() {
  return useIsPersonalDataAvailable()
}

const GoldItem: FC = () => (
  <ListItem>
    <ListItemText
      primary="Gold in the castle"
      secondary={<Gold />}
    />
  </ListItem>
)

export default GoldItem
