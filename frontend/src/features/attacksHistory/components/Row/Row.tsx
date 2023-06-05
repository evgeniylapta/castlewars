import * as React from 'react'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import IconButton from '@mui/material/IconButton'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Collapse from '@mui/material/Collapse'
import { FC } from 'react'
import { format } from 'date-fns'
import { AttacksHistory } from '../../types'
import { useCastleContext } from '../../../../entities/castle'
import HistoryDetails from '../HistoryDetails/HistoryDetails'
import { AttackIcon } from '../../../../entities/attack'
import styles from './Row.module.scss'

function useIsAttack({ castleFromId }: AttacksHistory) {
  const { selectedCastleQuery: { data: selectedCastle } } = useCastleContext()

  return castleFromId === selectedCastle?.id
}

function useDate({ attackDate }: AttacksHistory) {
  return format(new Date(attackDate), 'yyyy-MM-dd k:mm:ss')
}

type Props = {
  history: AttacksHistory
}
const Row: FC<Props> = ({ history }) => {
  const [open, setOpen] = React.useState(false)
  const isAttack = useIsAttack(history)

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <div className={styles.type}>
            <AttackIcon isFrom={isAttack} />
            <span>{isAttack ? 'Attack' : 'Defence'}</span>
          </div>
        </TableCell>
        <TableCell>
          todo from/to
        </TableCell>
        <TableCell align="right">
          {useDate(history)}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ padding: 0, borderBottom: 'none' }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <HistoryDetails items={history.items} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default Row
