import { FC } from 'react'
import { ListItem, ListItemText } from '@mui/material'
import { useIsPersonalDataAvailable } from '../../../hooks/useIsPersonalDataAvailable'
import { Gold } from '../../../../../features/gold'

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
