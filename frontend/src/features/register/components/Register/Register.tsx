import {
  FC, ReactNode, useEffect
} from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@mui/material'
import {
  emailValidation, maxLengthRule,
  minLengthRule,
  passwordRepeat,
  requiredRule,
  CustomTextField,
  CustomSelect,
  TSelectOption
} from '../../../../shared'
import styles from './Register.module.scss'
import { useRegisterMutation } from '../../query'
import { FormData } from '../../types'
import { useTribeTypesQuery } from '../../../../entities/tribe'

function useFormInit() {
  return useForm<FormData>()
}

function useSubmit(callback?: () => void) {
  const { mutateAsync } = useRegisterMutation()

  return async (data: FormData) => {
    await mutateAsync(data)

    callback?.()
  }
}

function useRepeatPasswordTrigger({
  watch,
  trigger,
  formState: { isSubmitted }
}: ReturnType<typeof useFormInit>) {
  const password = watch('password')

  useEffect(() => {
    if (isSubmitted) {
      trigger('passwordRepeat')
    }
  }, [password, isSubmitted])
}

function useTribeTypeOptions(): TSelectOption[] {
  return useTribeTypesQuery().data?.map(({ name, id }) => ({ label: name, value: id })) || []
}

type Props = {
  extraContent?: ReactNode
  onRegistered?: () => void
}

const Register: FC<Props> = ({ extraContent, onRegistered }) => {
  const formReturn = useFormInit()
  const { handleSubmit, control, watch } = formReturn
  useRepeatPasswordTrigger(formReturn)
  const password = watch('password')

  return (
    <form className={styles.form} onSubmit={handleSubmit(useSubmit(onRegistered))}>
      <CustomTextField
        label="Email"
        fieldName="email"
        rules={{
          required: requiredRule(),
          validate: emailValidation
        }}
        control={control}
      />

      <CustomTextField
        label="User name"
        fieldName="userName"
        rules={{
          required: requiredRule()
        }}
        control={control}
      />

      <CustomSelect
        label="Tribe Type"
        control={control}
        name="tribeTypeId"
        options={useTribeTypeOptions()}
        rules={{
          required: requiredRule()
        }}
      />

      <CustomTextField
        label="Password"
        fieldName="password"
        type="password"
        rules={{
          required: requiredRule(),
          minLength: minLengthRule(4),
          maxLength: maxLengthRule(20)
        }}
        control={control}
      />

      <CustomTextField
        label="Repeat password"
        fieldName="passwordRepeat"
        type="password"
        rules={{
          validate: passwordRepeat(password)
        }}
        control={control}
      />

      <div className={styles.buttonWrap}>
        <div>
          {extraContent}
        </div>

        <Button variant="contained" color="primary" type="submit">
          Register
        </Button>
      </div>
    </form>
  )
}

export default Register
