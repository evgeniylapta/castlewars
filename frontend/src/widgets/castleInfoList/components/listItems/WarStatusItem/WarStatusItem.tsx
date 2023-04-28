import { FC } from 'react'
import { ListItem, ListItemText } from '@mui/material'
import { AttacksStatus } from '../../../../../features/attacksStatus'
import { useIsPersonalDataAvailable } from '../../../../../entities/castle/hooks/useIsPersonalDataAvailable'
import { useHasActiveAttacksStatus } from '../../../../../features/attacksStatus/hooks/useHasActiveAttacksStatus'

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
