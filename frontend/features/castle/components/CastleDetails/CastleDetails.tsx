import { FC } from 'react'
import { Typography } from '@mui/material'
import { useSelectedCastleDetailsContext } from '../../index'
import { Tribe } from '../../../tribe'
import { useIsCurrentUserCastleSelected } from '../../hooks/useIsCurrentUserCastleSelected'

const CastleDetails: FC = () => {
  const { castleDetailsQuery: { data: castleDetails } } = useSelectedCastleDetailsContext()
  const isMyCastle = useIsCurrentUserCastleSelected()

  if (!castleDetails) {
    return null
  }

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
      {castleDetails.user.name}
      {' '}
      {isMyCastle && ('(me)')}
      <br />
      <Typography
        component="span"
        variant="body2"
        color="text.primary"
      >
        Coords:
      </Typography>
      {' '}
      {`[x: ${castleDetails.x} y: ${castleDetails.y}]`}
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

export default CastleDetails
