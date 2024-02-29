import { FC } from 'react'
import { Typography } from '@mui/material'
import { addSeconds, formatDistanceStrict, isAfter } from 'date-fns'
import styles from './InProgress.module.scss'
import UnitIcon from '../../../../entities/unit/components/UnitIcon/UnitIcon'
import { useUnitsOrderStatusContext } from '../../contexts/unitsOrderStatusContext'
import { UnitsOrder } from '../../types'
import { useNewDateInterval } from '../../../../shared'
import { useUnitTypesContext } from '../../../../entities/unit'

function getFirstQueueItem(unitsOrder?: UnitsOrder) {
  return unitsOrder?.items?.[0]
}

function useTime() {
  const { unitsOrdersQuery: { data: unitsOrder } } = useUnitsOrderStatusContext()
  const { unitTypesQuery: { data: unitTypes } } = useUnitTypesContext()
  const unitType = unitTypes?.find(({ id }) => id === getFirstQueueItem(unitsOrder)?.unitTypeId)
  const dateTick = useNewDateInterval()

  if (!unitsOrder || !unitTypes || !unitType) {
    return undefined
  }

  const unitCreationDate = addSeconds(new Date(unitsOrder.lastCreationDate), unitType.creatingSpeed)

  return formatDistanceStrict(
    isAfter(unitCreationDate, dateTick)
      ? unitCreationDate
      : dateTick,
    dateTick
  )
}

const InProgress: FC = () => {
  const { unitsOrdersQuery: { data: unitsOrder } } = useUnitsOrderStatusContext()
  const item = getFirstQueueItem(unitsOrder)

  const time = useTime()

  if (!item) {
    return null
  }

  return (
    <div className={styles.wrap}>
      <Typography variant="subtitle2">Unit in progress: </Typography>
      <UnitIcon unitTypeId={item.unitTypeId} />
      <Typography variant="body2">
        in
        {' '}
        {time}
      </Typography>
    </div>
  )
}

export default InProgress
