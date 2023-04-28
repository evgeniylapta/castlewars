import { FC } from 'react'
import { ListItem, ListItemText } from '@mui/material'
import { AttacksStatus } from '../../../../attacksStatus'
import { useIsPersonalDataAvailable } from '../../../hooks/useIsPersonalDataAvailable'
import { useHasActiveAttacksStatus } from '../../../../attacksStatus/hooks/useHasActiveAttacksStatus'

export function useIsAvailable() {
  return [
    useIsPersonalDataAvailable(),
    useHasActiveAttacksStatus()
  ].every((value) => value)
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
