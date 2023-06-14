import { Control, useFormState } from 'react-hook-form'

export function useFormFieldError(control: Control, fieldName: string) {
  const { errors } = useFormState({ control })
  const foundError = errors[fieldName]

  return {
    hasError: !!foundError,
    errorText: typeof foundError?.message === 'string'
      ? foundError?.message
      : undefined
  }
}
