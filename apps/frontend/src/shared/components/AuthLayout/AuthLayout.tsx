import { FC, ReactNode } from 'react'
import { Paper } from '@mui/material'
import styles from './AuthLayout.module.scss'

type Props = {
  children: ReactNode
}
const AuthLayout: FC<Props> = ({ children }) => (
  <div className={styles.wrap}>
    <Paper elevation={3}>
      {children}
    </Paper>
  </div>
)

export default AuthLayout
