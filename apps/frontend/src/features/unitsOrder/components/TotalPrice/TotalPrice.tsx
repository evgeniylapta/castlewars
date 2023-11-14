import { FC } from 'react'
import { FormHelperText, Typography } from '@mui/material'
import { useUnitsOrderFormContext } from '../../contexts/unitsOrderFormContext'

const TotalPrice: FC = () => {
  const {
    troopsTotal: {
      troopsTotalPrice,
      notEnoughGold,
      availableGold
    }
  } = useUnitsOrderFormContext()

  return (
    <FormHelperText
      error={notEnoughGold}
    >
      <Typography variant="body2">
        Total price:
        {' '}
        {troopsTotalPrice}
        {' '}
        /
        {' '}
        {availableGold}
      </Typography>
    </FormHelperText>
  )
}

export default TotalPrice
