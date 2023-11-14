import { FC, useEffect } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material'
import styles from './AttacksHistoryModal.module.scss'
import Table from '../Table/Table'
import { AttacksHistoryContextProvider, useAttacksHistoryContext } from '../../contexts/attacksHistoryContext'
import Pagination from '../Pagination/Pagination'

function useResetAttacksHistory(isOpened: boolean) {
  const { setIsActive } = useAttacksHistoryContext()

  useEffect(() => {
    setIsActive(isOpened)
  }, [isOpened])
}

type Props = {
  isOpened: boolean
  onClose: () => void
}
const AttacksHistoryModal: FC<Props> = ({ onClose, isOpened }) => {
  const { attacksHistoryQuery: { data } } = useAttacksHistoryContext()
  useResetAttacksHistory(isOpened)

  return (
    <Dialog maxWidth="md" fullWidth open={isOpened && !!data} onClose={onClose}>
      <DialogTitle>Attacks history</DialogTitle>
      <DialogContent>
        <Table />
      </DialogContent>
      <DialogActions className={styles.actions}>
        <Pagination />
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}

export default (props: Props) => (
  <AttacksHistoryContextProvider>
    <AttacksHistoryModal {...props} />
  </AttacksHistoryContextProvider>
)
