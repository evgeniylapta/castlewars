import { ReactElement } from 'react'
import { useRouter } from 'next/router'
import { Register } from '../src/features/register'
import type { NextPageExtended } from './_app'
import { AuthLayout } from '../src/shared'
import { LoginLink } from '../src/features/login'

const RegisterPage: NextPageExtended = () => {
  const router = useRouter()

  return <Register onRegistered={() => router.push('/game')} extraContent={<LoginLink />} />
}

RegisterPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthLayout>
      {page}
    </AuthLayout>
  )
}

export default RegisterPage
