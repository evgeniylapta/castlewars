import { ReactElement } from 'react'
import { useRouter } from 'next/router'
import { Login } from '../src/features/login'
import { RegisterLink } from '../src/features/register'
import type { NextPageExtended } from './_app'
import { AuthLayout } from '../src/shared'

const LoginPage: NextPageExtended = () => {
  const router = useRouter()

  return (
    <Login
      extraContent={<RegisterLink />}
      onLoggedIn={() => router.push('/')}
    />
  )
}

LoginPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthLayout>
      {page}
    </AuthLayout>
  )
}

export default LoginPage
