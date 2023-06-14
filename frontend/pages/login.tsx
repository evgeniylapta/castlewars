import { ReactElement } from 'react'
import { useRouter } from 'next/router'
import { Login } from '../src/features/login'
import { RegisterLink } from '../src/features/register'
import type { NextPageWithLayout } from './_app'
import { AuthLayout } from '../src/shared'

const LoginPage: NextPageWithLayout = () => {
  const router = useRouter()

  return (
    <Login
      extraContent={<RegisterLink />}
      onLoggedIn={() => router.push('/game')}
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
