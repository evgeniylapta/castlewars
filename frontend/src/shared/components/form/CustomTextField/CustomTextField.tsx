import {
  FC, ReactNode, useId
} from 'react'
import {
  InputAdornment, TextFieldProps, TextField
} from '@mui/material'
import {
  Control, RegisterOptions, useController, useFormState
} from 'react-hook-form'

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

function useError(control: Control, fieldName: string) {
  const { errors } = useFormState({ control })
  const foundError = errors[fieldName]

  return {
    hasError: !!foundError,
    errorText: typeof foundError?.message === 'string'
      ? <span>{foundError?.message}</span>
      : undefined
  }
}

type Props = TextFieldProps & {
  label?: string | ReactNode
  fieldName: string
  startIcon?: ReactNode
  rules?: RegisterOptions
  control: Control
}
const CustomTextField: FC<Props> = ({
  control,
  fieldName,
  startIcon,
  label,
  rules,
  InputProps,
  ...rest
}) => (
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
    error={useError(control, fieldName).hasError}
    helperText={useError(control, fieldName).errorText}
    {...rest}
  />
)

export default CustomTextField
