import { ListItem, ListItemText } from '@mui/material'
import { UnitsOrderStatus, useUnitsOrderStatusContext } from '../../../../../features/unitsOrderStatus'

export function useIsAvailable() {
  const { unitsOrdersQuery } = useUnitsOrderStatusContext()

  return !!unitsOrdersQuery.data?.items?.length
}

const UnitsOrderStatusItem = () => (
  <ListItem>
    <ListItemText
      primary="Units ordering status"
      secondaryTypographyProps={{ component: 'div' }}
      secondary={<UnitsOrderStatus />}
    />
  </ListItem>
)

export default UnitsOrderStatusItem
