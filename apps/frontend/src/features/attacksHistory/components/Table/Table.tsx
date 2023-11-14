import { FC, useRef } from 'react'
import MuiTable from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import * as React from 'react'
import Row from '../Row/Row'
import { useAttacksHistoryContext } from '../../contexts/attacksHistoryContext'

const Table: FC = () => {
  const { attacksHistoryQuery: { data } } = useAttacksHistoryContext()

  const tableRef = useRef<HTMLDivElement>(null)

  return (
    <TableContainer ref={tableRef}>
      <MuiTable>
        <TableBody>
          {data?.items.map((attacksHistory) => (
            <Row key={attacksHistory.id} history={attacksHistory} />
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  )
}

export default Table
