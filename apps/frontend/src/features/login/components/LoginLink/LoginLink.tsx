import { FC } from 'react'
import { Button } from '@mui/material'
import Link from 'next/link'

const LoginLink: FC = () => (
  <Link href="/login">
    <Button variant="outlined">
      Go to login
    </Button>
  </Link>
)

export default LoginLink
