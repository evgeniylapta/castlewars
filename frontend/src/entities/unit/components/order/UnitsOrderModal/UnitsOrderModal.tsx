import { FC, useCallback } from 'react'
import {
  Button,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material'
import { ClassNameable } from '../../../../../shared/types'
import { useAuthContext } from '../../../../auth'
import { useUnitTypesByTribeId } from '../../../hooks/useUnitTypesByTribeId'
import { UnitsOrderFormContextProvider } from '../../../contexts/unitsOrderFormContext'
import FormItem from '../FormItem/FormItem'
import styles from './UnitsOrderModal.module.scss'
import TotalPrice from '../TotalPrice/TotalPrice'
import Submit from '../Submit/Submit'

function useUnitTypes() {
  const { currentUserQuery: { data: currentUser } } = useAuthContext()
  return useUnitTypesByTribeId(currentUser?.tribeTypeId)
}

type Props = {
  isOpened: boolean
  onClose: () => void
} & ClassNameable

const UnitsOrderModal: FC<Props> = ({ onClose, isOpened }) => (
  <Dialog maxWidth="xs" fullWidth open={isOpened} onClose={onClose}>
    <UnitsOrderFormContextProvider>
      <DialogTitle>Troops ordering</DialogTitle>
      <DialogContent>
        {useUnitTypes()?.map((unitType) => (
          <div key={unitType.id} className={styles.item}>
            <FormItem unitType={unitType} />
          </div>
        ))}
        <div className={styles.total}>
          <TotalPrice />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Submit onClose={onClose} />
      </DialogActions>
    </UnitsOrderFormContextProvider>
  </Dialog>
)

export default UnitsOrderModal
