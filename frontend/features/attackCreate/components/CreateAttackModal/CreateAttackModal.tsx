import { FC } from 'react'
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material'
import { CreateAttackContextProvider } from '../../contexts/createAttackContext'
import Submit from '../Submit/Submit'
import Distance from '../Distance/Distance'
import AttackTime from '../AttackTime/AttackTime'
import FormItems from '../FormItems/FormItems'
import styles from './CreateAttackModal.module.scss'

type Props = {
  isOpened: boolean
  onClose: () => void
}

const CreateAttackModal: FC<Props> = ({ onClose, isOpened }) => (
  <Dialog maxWidth="xs" fullWidth open={isOpened} onClose={onClose}>
    <CreateAttackContextProvider>
      <DialogTitle>Create attack</DialogTitle>
      <DialogContent>
        <FormItems />
        <div className={styles.distance}>
          <Distance />
        </div>
        <AttackTime />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Submit onClose={onClose} />
      </DialogActions>
    </CreateAttackContextProvider>
  </Dialog>
)

export default CreateAttackModal
