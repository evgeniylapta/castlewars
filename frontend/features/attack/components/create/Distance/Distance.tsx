import { FC } from 'react'
import { FormHelperText, Typography } from '@mui/material'
import { useCreateAttackContext } from '../../../contexts/createAttackContext'

const Distance: FC = () => {
  const { distance } = useCreateAttackContext()

  return (
    <FormHelperText
      error={false}
    >
      <Typography variant="body2">
        Distance:
        {' '}
        {distance}
        {' '}
        cells
      </Typography>
    </FormHelperText>
  )
}

export default Distance
