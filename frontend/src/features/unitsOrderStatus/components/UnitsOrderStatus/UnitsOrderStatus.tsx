import { FC } from 'react'
import styles from './UnitsOrderStatus.module.scss'
import Queue from '../Queue/Queue'
import InProgress from '../InProgress/InProgress'

const UnitsOrderStatus: FC = () => (
  <div className={styles.wrap}>
    <InProgress />
    <Queue />
  </div>
)

export default UnitsOrderStatus
