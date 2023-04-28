import { FC } from 'react'
import { ListItem, ListItemText } from '@mui/material'
import { AttacksStatus } from '../../../../attack'
import { useIsPersonalDataAvailable } from '../../../hooks/useIsPersonalDataAvailable'
import { useHasActiveAttacksStatus } from '../../../../attack/hooks/useHasActiveAttacksStatus'

export function useIsAvailable() {
  return useIsPersonalDataAvailable() && useHasActiveAttacksStatus()
}

const WarStatusItem: FC = () => (
  <ListItem>
    <ListItemText
      primary="War status"
      secondaryTypographyProps={{
        component: 'div'
      }}
      secondary={<AttacksStatus />}
    />
  </ListItem>
)

export default WarStatusItem
