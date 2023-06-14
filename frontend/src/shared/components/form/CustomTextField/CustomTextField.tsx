import {
  FC, ReactNode, useId
} from 'react'
import {
  InputAdornment, TextFieldProps, TextField
} from '@mui/material'
import {
  Control, RegisterOptions, useController
} from 'react-hook-form'
import { useFormFieldError } from '../../../hooks/useFormFieldError'

function useStartAdornment(startIcon?: ReactNode) {
  if (!startIcon) {
    return undefined
  }

  return (
    <InputAdornment position="start">
      {startIcon}
    </InputAdornment>
  )
}

type Props = TextFieldProps & {
  label?: string | ReactNode
  fieldName: string
  startIcon?: ReactNode
  rules?: RegisterOptions
  control: Control<any>
}
const CustomTextField: FC<Props> = ({
  control,
  fieldName,
  startIcon,
  label,
  rules,
  InputProps,
  ...rest
}) => {
  const { hasError, errorText } = useFormFieldError(control, fieldName)

  return (
    <TextField
      {...useController({ name: fieldName, control, rules }).field}
      id={useId()}
      variant="standard"
      fullWidth
      label={label}
      InputProps={{
        startAdornment: useStartAdornment(startIcon),
        ...InputProps
      }}
      error={hasError}
      helperText={errorText}
      {...rest}
    />
  )
}

export default CustomTextField
