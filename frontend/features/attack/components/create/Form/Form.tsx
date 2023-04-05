import {
  FC, useCallback, useEffect, useMemo, useState
} from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { calculateDistanceBetweenPoints, getUnitTypesMovingSeconds } from 'sharedUtils'
import {
  addSeconds, format, formatDuration, intervalToDuration
} from 'date-fns'
import { useMyCastleContext, useSelectedCastleDetailsContext } from '../../../../castle'
import styles from './Form.module.scss'
import FormItem from '../FormItem/FormItem'
import { useCreateAttackMutation } from '../../../query'
import { useMapCenterContext } from '../../../../map'
import { findUnitTypeById, UnitTypesResponseItem, useUnitTypesContext } from '../../../../unit'
import { useNewDateInterval } from '../../../../../shared/hooks/useNewDateInterval'
import { usePreparedUnitGroups } from '../../../../unit/hooks/usePreparedUnitGroups'
import { useUnitTypesByTribeId } from '../../../../unit/hooks/useUnitTypesByTribeId'

function useDistance() {
  const { castleDetailsQuery: { data: selectedCastleDetails } } = useSelectedCastleDetailsContext()
  const { myCastleDetailsQuery: { data: myCastleDetails } } = useMyCastleContext()

  return useMemo(() => {
    if (!selectedCastleDetails || !myCastleDetails) {
      return 0
    }

    return calculateDistanceBetweenPoints(
      myCastleDetails.x,
      myCastleDetails.y,
      selectedCastleDetails.x,
      selectedCastleDetails.y
    )
  }, [selectedCastleDetails, myCastleDetails])
}

function useAttackTime(distance: number, { watch }: UseFormReturn) {
  const { unitTypesQuery: { data: unitTypes } } = useUnitTypesContext()

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
          getUnitTypesMovingSeconds(
            filledTypes as UnitTypesResponseItem[],
            distance
          )
        ),
      })
      : undefined

    return duration ? formatDuration(duration) : undefined
  }, [newDate, formData])
}

function useSubmitHandle(cancel: () => void) {
  const { castleDetailsQuery: { data: selectedCastleDetails } } = useSelectedCastleDetailsContext()
  const { mutateAsync } = useCreateAttackMutation()
  const { goToMyCastlePoint } = useMapCenterContext()

  return useCallback(async (data: any) => {
    if (!selectedCastleDetails) {
      return null
    }

    const preparedData = Object.fromEntries(Object.entries(data).filter(([, value]) => !!value))

    await mutateAsync({
      data: preparedData,
      castleId: selectedCastleDetails.id
    })

    goToMyCastlePoint()
    cancel()

    return Promise.resolve()
  }, [])
}

function useIsSubmitDisabled(useFormReturn: UseFormReturn) {
  const { formState: { isValid }, watch } = useFormReturn

  const noValue = !Object.entries(watch()).filter(([, value]) => !!value).length

  return !isValid || noValue
}

type Props = {
  onCancel: () => void
}

const Form: FC<Props> = ({ onCancel }) => {
  const { myCastleDetailsQuery: { data: myCastleDetails } } = useMyCastleContext()
  const useFormReturn = useForm()
  const { handleSubmit } = useFormReturn
  const distance = useDistance()
  const attackTime = useAttackTime(distance, useFormReturn)
  const isSubmitDisabled = useIsSubmitDisabled(useFormReturn)
  const submitHandle = useSubmitHandle(onCancel)
  const preparedUnitGroups = usePreparedUnitGroups(myCastleDetails?.unitGroups)
  const unitTypes = useUnitTypesByTribeId(myCastleDetails?.user.tribeId)

  return (
    <>
      <div>
        Distance:
        {distance}
      </div>
      <form onSubmit={handleSubmit(submitHandle)}>
        {unitTypes?.map((unitType) => (
          <FormItem
            key={unitType.id}
            unitGroup={preparedUnitGroups?.find(({ unitTypeId }) => unitType.id === unitTypeId)}
            unitType={unitType}
            useFormReturn={useFormReturn}
            className={styles.item}
          />
        ))}
        {attackTime && !isSubmitDisabled && (
          <div>
            Attack will happen in
            {attackTime}
          </div>
        )}
        <button type="submit" disabled={isSubmitDisabled} className={styles.button}>Send troops</button>
        {' '}
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </>
  )
}

export default Form
