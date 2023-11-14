import constate from 'constate'
import { useMemo } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { calculateDistanceBetweenPoints } from '@castlewars/shared-utils'
import { useCastleContext } from '../../../entities/castle'
import { useUnitTypesByTribeId } from '../../../entities/unit'
import { CreateAttackFormData } from '../types'
import { useCreateAttackMutation } from '../query'

function useUnitTypes() {
  const { myCastleQuery: { data: myCastle } } = useCastleContext()

  return useUnitTypesByTribeId(myCastle?.user.tribeTypeId)
}

function useIsSubmitDisabled(useFormReturn: UseFormReturn<CreateAttackFormData>) {
  const { watch, formState: { isValid } } = useFormReturn
  const noValue = !Object.values(watch()).filter((value) => !!value).length

  return !isValid || noValue
}

function useDistance() {
  const {
    selectedCastleQuery: { data: selectedCastleDetails },
    myCastleQuery: { data: myCastleDetails }
  } = useCastleContext()

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

function useSubmitHandle(
  { getValues }: UseFormReturn<CreateAttackFormData>,
  onSubmitSuccess?: () => void
) {
  const { selectedCastleQuery: { data: selectedCastle } } = useCastleContext()
  const { mutateAsync } = useCreateAttackMutation()

  return async (callback: () => void) => {
    if (!selectedCastle) {
      return null
    }

    const preparedData = Object.fromEntries(
      Object.entries(getValues())
        .filter(([, value]) => !!value)
        .map(([key, value]) => [key, Number(value)])
    )

    await mutateAsync({
      data: preparedData,
      castleId: selectedCastle.id
    })

    callback()
    onSubmitSuccess?.()

    return Promise.resolve()
  }
}

function useFormInit() {
  return useForm<CreateAttackFormData>({
    mode: 'onChange'
  })
}
type Props = {
  onSubmitSuccess?: () => void
}
const useContext = ({ onSubmitSuccess }: Props) => {
  const useFormReturn = useFormInit()

  return {
    useFormReturn,
    submitHandle: useSubmitHandle(useFormReturn, onSubmitSuccess),
    isSubmitDisabled: useIsSubmitDisabled(useFormReturn),
    distance: useDistance(),
    unitTypes: useUnitTypes()
  }
}

export const [CreateAttackContextProvider, useCreateAttackContext] = constate(useContext)
