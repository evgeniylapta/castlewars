import { RegisterOptions } from 'react-hook-form'

export const requiredRule: (message: string) => RegisterOptions['required'] = (message: string) => ({
  value: true,
  message: message || 'This field is required'
})

export const positiveNumberOnly = (value: number) => (value < 0 ? 'Positive number only' : undefined)

export const maxNumber: (num: number, msg?: string) => RegisterOptions['max'] = (num: number, msg?: string) => ({
  value: num,
  message: msg || `Max number is ${num}`
})
