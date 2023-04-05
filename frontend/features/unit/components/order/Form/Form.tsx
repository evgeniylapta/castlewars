import { FC, useCallback, useMemo } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import styles from './Form.module.scss'
import FormItem from '../FormItem/FormItem'
import { useUnitTypesByTribeId } from '../../../hooks/useUnitTypesByTribeId'
import { useAuthContext } from '../../../../auth'
import { useCastleResourcesContext } from '../../../../resources'
import { findUnitTypeById } from '../../../utils/unitTypeUtils'
import { useUnitTypesContext } from '../../../contexts/unitsContext'

function useSubmitHandle(onCancel: () => void) {
  return useCallback(async (data: any) => {
    console.log('data')
    console.log(data)

    onCancel()
  }, [])
}

function useIsSubmitDisabled(useFormReturn: UseFormReturn, troopsTotalPrice: number) {
  const { calculatedGold } = useCastleResourcesContext()
  const { formState: { isValid }, watch } = useFormReturn

  const noValue = !Object.entries(watch()).filter(([, value]) => !!value).length
  const totalMoreThanAvailable = (calculatedGold !== undefined && troopsTotalPrice > calculatedGold)

  return !isValid
    || noValue
    || totalMoreThanAvailable
}

type Props = {
  onCancel: () => void
}

function useTroopsTotalPrice({ watch }: UseFormReturn) {
  const { unitTypesQuery: { data: unitTypes } } = useUnitTypesContext()

  const formData = watch()

  return useMemo(
    () => Object.entries(formData)
      .filter(([, amount]) => !!amount)
      .reduce((result, [unitTypeId, amount]) => {
        const price = findUnitTypeById(unitTypeId, unitTypes)?.goldPrice
        return price ? (price * amount) + result : result
      }, 0),
    [formData, unitTypes]
  )
}

const Form: FC<Props> = ({ onCancel }) => {
  const { currentUserQuery: { data: currentUser } } = useAuthContext()
  const useFormReturn = useForm()
  const { handleSubmit } = useFormReturn
  const submitHandle = useSubmitHandle(onCancel)
  const unitTypes = useUnitTypesByTribeId(currentUser?.tribeId)
  const totalPrice = useTroopsTotalPrice(useFormReturn)
  const isSubmitDisabled = useIsSubmitDisabled(useFormReturn, totalPrice)

  return (
    <form onSubmit={handleSubmit(submitHandle)}>
      {unitTypes?.map((unitType) => (
        <FormItem
          key={unitType.id}
          unitType={unitType}
          useFormReturn={useFormReturn}
          className={styles.item}
        />
      ))}
      <div>
        Total price:
        {totalPrice}
      </div>
      <button type="submit" disabled={isSubmitDisabled} className={styles.button}>Order troops</button>
      {' '}
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  )
}

export default Form
