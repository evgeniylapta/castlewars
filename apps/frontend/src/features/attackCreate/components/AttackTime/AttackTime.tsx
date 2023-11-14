import { FC, useMemo } from 'react'
import { addSeconds, formatDuration, intervalToDuration } from 'date-fns'
import { FormHelperText, Typography } from '@mui/material'
import { findUnitTypeById, useUnitTypesContext } from '../../../../entities/unit'
import { useNewDateInterval } from '../../../../shared'
import { useCreateAttackContext } from '../../contexts/createAttackContext'
import { UnitType } from '../../../../commonTypes'
import { unitTypesMovingSeconds } from '@castlewars/shared-utils'

function useAttackTime() {
  const { unitTypesQuery: { data: unitTypes } } = useUnitTypesContext()

  const { useFormReturn: { watch }, distance } = useCreateAttackContext()

  const formData = watch()

  const newDate = useNewDateInterval()

  return useMemo(() => {
    const typeIds = Object.entries(formData)
      .filter(([, value]) => value && !Number.isNaN(value)).map(([type]) => type)

    const filledTypes = typeIds.map((typeId) => findUnitTypeById(typeId, unitTypes))

    const duration = filledTypes.length
      ? intervalToDuration({
        start: newDate,
        end: addSeconds(
          newDate,
          unitTypesMovingSeconds(
            filledTypes as UnitType[],
            distance
          )
        )
      })
      : undefined

    return duration ? formatDuration(duration) : undefined
  }, [newDate, formData, distance])
}

function useIsTimeHidden() {
  const { isSubmitDisabled } = useCreateAttackContext()

  const attackTime = useAttackTime()

  return !attackTime || isSubmitDisabled
}

const AttackTime: FC = () => {
  const attackTime = useAttackTime()

  return (
    <FormHelperText>
      <Typography variant="body2">
        The attack will happen in
        {' '}
        {useIsTimeHidden() ? '-//-' : attackTime}
      </Typography>
    </FormHelperText>
  )
}

export default AttackTime
