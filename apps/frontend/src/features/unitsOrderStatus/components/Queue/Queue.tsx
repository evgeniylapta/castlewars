import { FC } from 'react'
import { Typography } from '@mui/material'
import styles from './Queue.module.scss'
import { useUnitsOrderStatusContext } from '../../contexts/unitsOrderStatusContext'
import { UnitsList } from '../../../../entities/unit'

const Queue: FC = () => {
  const { data: unitsOrder } = useUnitsOrderStatusContext().unitsOrdersQuery

  const items = unitsOrder?.items

  if (!items?.length) {
    return null
  }

  return (
    <div className={styles.wrap}>
      <Typography variant="subtitle2">Queue: </Typography>
      <div className={styles.list}>
        <UnitsList items={items} />
      </div>
    </div>
  )
}

export default Queue
