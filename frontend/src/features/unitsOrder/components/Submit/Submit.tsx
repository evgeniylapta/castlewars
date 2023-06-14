import { FC } from 'react'
import {
  Button
} from '@mui/material'
import { ClassNameable } from '../../../../shared'
import { useUnitsOrderFormContext } from '../../contexts/unitsOrderFormContext'

function useIsSubmitDisabled() {
  const {
    useFormReturn: { formState: { isValid }, watch },
    troopsTotal: { notEnoughGold }
  } = useUnitsOrderFormContext()

  const noValue = !Object.entries(watch()).filter(([, value]) => !!value).length

  return !isValid
    || noValue
    || notEnoughGold
}

type Props = {
  onClose: () => void
} & ClassNameable

const Submit: FC<Props> = ({ onClose }) => {
  const { submitHandle } = useUnitsOrderFormContext()

  return (
    <Button
      disabled={useIsSubmitDisabled()}
      onClick={() => submitHandle(onClose)}
    >
      Order troops
    </Button>
  )
}

export default Submit
