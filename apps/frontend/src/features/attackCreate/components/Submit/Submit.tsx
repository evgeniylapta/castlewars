import { FC } from 'react'
import {
  Button
} from '@mui/material'
import { ClassNameable } from '../../../../shared'
import { useCreateAttackContext } from '../../contexts/createAttackContext'

type Props = {
  onClose: () => void
} & ClassNameable

const Submit: FC<Props> = ({ onClose }) => {
  const { submitHandle, isSubmitDisabled } = useCreateAttackContext()

  return (
    <Button
      disabled={isSubmitDisabled}
      onClick={() => submitHandle(onClose)}
    >
      Send troops
    </Button>
  )
}

export default Submit
