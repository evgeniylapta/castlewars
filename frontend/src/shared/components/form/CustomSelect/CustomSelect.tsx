import { FC } from 'react'
import { Control, RegisterOptions, useController } from 'react-hook-form'
import {
  FormControl, FormHelperText, InputLabel, MenuItem, Select
} from '@mui/material'
import { SelectProps } from '@mui/material/Select/Select'
import styles from './CustomSelect.module.scss'
import { useFormFieldError } from '../../../hooks/useFormFieldError'

export type TSelectOption = {
  label: string
  value: string | number | any
}

type TProps = SelectProps & {
  name: string
  label: string
  placeholder?: string
  control: Control<any>
  options: TSelectOption[],
  rules?: RegisterOptions
}

const CustomSelect: FC<TProps> = ({
  name,
  label,
  control,
  options,
  rules,
  ...rest
}) => {
  const { field: { value, onChange }, fieldState: { invalid } } = useController({
    name,
    control,
    rules
  })

  const { hasError, errorText } = useFormFieldError(control, name)

  return (
    <div className={styles.wrap}>
      <FormControl variant="standard" error={hasError}>
        <InputLabel>{label}</InputLabel>
        <Select
          data-testid={`${name}-select-wrapper`}
          onChange={onChange}
          value={value || ''}
          fullWidth
          displayEmpty
          error={invalid}
          {...rest}
        >
          {options?.map(({ label: itemLabel, value: itemValue }) => (
            <MenuItem key={itemValue} value={itemValue}>
              {itemLabel}
            </MenuItem>
          ))}
        </Select>
        {errorText && <FormHelperText>{errorText}</FormHelperText>}
      </FormControl>
    </div>
  )
}

export default CustomSelect
