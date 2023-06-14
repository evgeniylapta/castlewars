import { FC } from 'react'
import { Button } from '@mui/material'
import Link from 'next/link'

const RegisterLink: FC = () => (
  <Link href="/register">
    <Button variant="outlined">
      Go to registration
    </Button>
  </Link>
)

export default RegisterLink
