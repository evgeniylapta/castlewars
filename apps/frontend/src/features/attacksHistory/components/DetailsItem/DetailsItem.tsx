import * as React from 'react'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import { FC } from 'react'
import { AttacksHistoryItem as Item } from '../../types'
import styles from './DetailsItem.module.scss'
import { UnitIcon } from '../../../../entities/unit'

type Props = {
  isDefence: boolean
  items: Item[]
}
const DetailsItem: FC<Props> = ({ items, isDefence }) => (
  <TableRow>
    <TableCell>
      {isDefence ? 'Defence' : 'Offense'}
    </TableCell>
    <TableCell align="center">
      {items.map(({ unitTypeId, oldAmount }) => (
        <span className={styles.amount}>
          <UnitIcon unitTypeId={unitTypeId} />
          {oldAmount}
        </span>
      ))}
    </TableCell>
    <TableCell align="center">
      {items.map(({ unitTypeId, oldAmount, newAmount }) => (
        <span className={styles.amount}>
          <UnitIcon unitTypeId={unitTypeId} />
          <span>{oldAmount - newAmount}</span>
        </span>
      ))}
    </TableCell>
    <TableCell align="center">
      {items.map(({ unitTypeId, newAmount }) => (
        <span className={styles.amount}>
          <UnitIcon unitTypeId={unitTypeId} />
          {newAmount}
        </span>
      ))}
    </TableCell>
  </TableRow>
)

export default DetailsItem
