import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useMyCastleContext, useSelectedCastleDetailsContext } from '../../../../castle';
import styles from './Form.module.scss';
import { useForm, UseFormReturn } from 'react-hook-form';
import FormItem from '../FormItem/FormItem';
import { useCreateAttackMutation } from '../../../query';
import { useMapCenterContext } from '../../../../map';
import { calculateDistanceBetweenPoints, getUnitTypesMovingSeconds } from 'sharedUtils';
import { findUnitTypeById, TUnitTypesResponseItem, useUnitTypesContext } from '../../../../unit';
import { addSeconds, format, formatDuration, intervalToDuration } from 'date-fns';
import { useNewDateInterval } from '../../../../../shared/hooks/useNewDateInterval';

function useDistance() {
  const { castleDetailsQuery: { data: selectedCastleDetails } } = useSelectedCastleDetailsContext()
  const { myCastleDetailsQuery: { data: myCastleDetails } } = useMyCastleContext()

  return  useMemo(() => {
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
    const typeIds = Object.entries(formData).filter(([,value]) => value && !isNaN(value)).map(([type]) => type)

    const filledTypes = typeIds.map((typeId) => findUnitTypeById(typeId, unitTypes))

    const duration = filledTypes.length
      ? intervalToDuration({
        start: newDate,
        end: addSeconds(newDate, getUnitTypesMovingSeconds(filledTypes as TUnitTypesResponseItem[], distance))
      })
      : undefined

    // console.log(duration);

    return duration ? formatDuration(duration) : undefined
  } , [newDate, formData])
}

type TProps = {
  onCancel: () => void
}

const Form: FC<TProps> = ({ onCancel }) => {
  const { myCastleDetailsQuery: { data: myCastleDetails } } = useMyCastleContext()
  const { mutateAsync } = useCreateAttackMutation()
  const useFormReturn = useForm()
  const { handleSubmit, formState: { isValid }, watch } = useFormReturn
  const { castleDetailsQuery: { data: selectedCastleDetails } } = useSelectedCastleDetailsContext()
  const { goToMyCastlePoint } = useMapCenterContext()
  const distance = useDistance()
  const attackTime = useAttackTime(distance, useFormReturn)

  const isDisabled = !isValid || !Object.entries(watch()).filter(([, value]) => !!value).length

  return (
    <>
      <div>Distance: {distance}</div>
      <form onSubmit={handleSubmit(async (data) => {
        // todo move to method
        if (!selectedCastleDetails) {
          return null;
        }

        const preparedData = Object.fromEntries(Object.entries(data).filter(([,value]) => !!value))

        await mutateAsync({
          data: preparedData,
          castleId: selectedCastleDetails.id
        })

        goToMyCastlePoint()
      })}>
        {myCastleDetails?.unitGroups.map((unitGroup) => (
          <FormItem key={unitGroup.id} unitGroup={unitGroup} useFormReturn={useFormReturn} className={styles.item} />
        ))}
        {attackTime && !isDisabled && <div>Attack will happen in {attackTime}</div>}
        <button type="submit" disabled={isDisabled} className={styles.button}>Send troops</button>
        {' '}
        <button onClick={onCancel}>Cancel</button>
      </form>
    </>
  )
}

export default Form
