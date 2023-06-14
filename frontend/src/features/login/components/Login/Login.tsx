import { Button, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { FC, ReactNode } from 'react'
import { emailValidation, requiredRule, CustomTextField } from '../../../../shared'
import styles from './Login.module.scss'
import { FormData } from '../../types'
import { useLoginMutation } from '../../query'
import { useTokensModelHandle } from '../../../../entities/auth'

function useSubmit(callback?: () => void) {
  const { mutateAsync } = useLoginMutation()

  const handleTokensModel = useTokensModelHandle()

  return async (data: FormData) => {
    handleTokensModel(await mutateAsync(data))

    callback?.()
  }
}

type Props = {
  extraContent?: ReactNode
  onLoggedIn?: () => void
}

const Login: FC<Props> = ({ extraContent, onLoggedIn }) => {
  const { handleSubmit, control } = useForm<FormData>()

  return (
    <>
      <Typography variant="body2">Admin credentials:</Typography>
      <Typography variant="subtitle2">admin@example.com / password</Typography>

      <br />

      <Typography variant="body2">User credentials:</Typography>
      <Typography variant="subtitle2">user@example.com / password</Typography>

      <form className={styles.form} onSubmit={handleSubmit(useSubmit(onLoggedIn))}>
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
          label="Password"
          fieldName="password"
          type="password"
          rules={{
            required: requiredRule()
          }}
          control={control}
        />

        <div className={styles.buttonsGroup}>
          <div>
            {extraContent}
          </div>

          <Button variant="contained" color="primary" type="submit">
            Log In
          </Button>
        </div>
      </form>
    </>
  )
}

export default Login
