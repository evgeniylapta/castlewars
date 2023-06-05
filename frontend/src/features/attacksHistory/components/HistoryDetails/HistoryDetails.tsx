import * as React from 'react'
import { FC } from 'react'
import { Table, TableBody, TableHead } from '@mui/material'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { AttacksHistoryItem as Item } from '../../types'
import AttacksHistoryDetail from '../DetailsItem/DetailsItem'
import styles from './HistoryDetails.module.scss'

type Props = {
  items: Item[]
}
const HistoryDetails: FC<Props> = ({ items }) => (
  <div className={styles.wrap}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell />
          <TableCell align="center">Before</TableCell>
          <TableCell align="center">Losses</TableCell>
          <TableCell align="center">After</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <AttacksHistoryDetail
          items={items.filter(({ isDefence }) => !isDefence)}
          isDefence={false}
        />
        <AttacksHistoryDetail
          items={items.filter(({ isDefence }) => isDefence)}
          isDefence
        />
      </TableBody>
    </Table>
  </div>
)

export default HistoryDetails
