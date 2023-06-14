import { RegisterOptions, ValidateResult } from 'react-hook-form'

export const requiredRule: (message?: string) => RegisterOptions['required'] = (message?: string) => ({
  value: true,
  message: message || 'This field is required'
})

export const positiveNumberOnly = (value: number) => (value < 0 ? 'Positive number only' : undefined)

export const maxNumber: (num: number, msg?: string) => RegisterOptions['max'] = (num: number, msg?: string) => ({
  value: num,
  message: msg || `Max number is ${num}`
})

export const EMAIL_VALIDATION = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i

export const emailValidation: RegisterOptions['validate'] = (email: string): ValidateResult => EMAIL_VALIDATION.test(email)
  || 'Wrong data, please provide correct email.'

export const passwordRepeat: (firstPassword: string) => RegisterOptions['validate'] = (firstPassword: string) => (value: string): ValidateResult => value === firstPassword
    || 'Passwords do not match'

export const minLengthRule: (num: number) => RegisterOptions['minLength'] = (num) => ({
  value: num,
  message: `Length should be more than ${num}`
})

export const maxLengthRule: (num: number) => RegisterOptions['maxLength'] = (num) => ({
  value: num,
  message: `Length should be less than ${num}`
})
