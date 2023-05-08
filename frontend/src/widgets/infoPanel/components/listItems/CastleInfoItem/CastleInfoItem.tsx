import { FC } from 'react'
import { ListItem, ListItemText, Typography } from '@mui/material'
import { useCastleContext } from '../../../../../entities/castle'
import { Tribe } from '../../../../../features/tribe'

export function useIsAvailable() {
  return true
}

function useUserName() {
  const {
    selectedCastleQuery: { data },
    isMyCastleSelected
  } = useCastleContext()

  return `${data?.user.name} ${isMyCastleSelected ? '(me)' : ''}`
}

function useCoordsString() {
  const { selectedCastleQuery: { data } } = useCastleContext()

  return `[x: ${data?.x} y: ${data?.y}]`
}

function useCastleInfo() {
  return (
    <>
      <Typography
        component="span"
        variant="body2"
        color="text.primary"
      >
        User name:
      </Typography>
      {' '}
      {useUserName()}
      <br />
      <Typography
        component="span"
        variant="body2"
        color="text.primary"
      >
        Coords:
      </Typography>
      {' '}
      {useCoordsString()}
      <br />
      <Typography
        component="span"
        variant="body2"
        color="text.primary"
      >
        Tribe:
      </Typography>
      {' '}
      <Tribe />
    </>
  )
}

const CastleInfoItem: FC = () => (
  <ListItem>
    <ListItemText
      primary="Selected castle info"
      secondaryTypographyProps={{ component: 'div' }}
      secondary={useCastleInfo()}
    />
  </ListItem>
)

export default CastleInfoItem
