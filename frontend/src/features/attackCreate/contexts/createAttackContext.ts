import constate from 'constate'
import { useMemo } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { calculateDistanceBetweenPoints } from 'sharedUtils'
import { useMyCastleContext, useSelectedCastleDetailsContext } from '../../../entities/castle'
import { useMapCenterContext } from '../../map'
import { useUnitTypesByTribeId } from '../../../entities/unit/hooks/useUnitTypesByTribeId'
import { CreateAttackFormData } from '../types'
import { useCreateAttackMutation } from '../query'

function useUnitTypes() {
  const { myCastleDetailsQuery: { data: myCastleDetails } } = useMyCastleContext()

  return useUnitTypesByTribeId(myCastleDetails?.user.tribeTypeId)
}

function useIsSubmitDisabled(useFormReturn: UseFormReturn<CreateAttackFormData>) {
  const { watch, formState: { isValid } } = useFormReturn
  const noValue = !Object.values(watch()).filter((value) => !!value).length

  return !isValid || noValue
}

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

function useSubmitHandle({ getValues }: UseFormReturn<CreateAttackFormData>) {
  const { castleDetailsQuery: { data: selectedCastleDetails } } = useSelectedCastleDetailsContext()
  const { mutateAsync } = useCreateAttackMutation()
  const { goToMyCastlePoint } = useMapCenterContext()

  return async (callback: () => void) => {
    if (!selectedCastleDetails) {
      return null
    }

    const preparedData = Object.fromEntries(
      Object.entries(getValues())
        .filter(([, value]) => !!value)
        .map(([key, value]) => [key, Number(value)])
    )

    await mutateAsync({
      data: preparedData,
      castleId: selectedCastleDetails.id
    })

    goToMyCastlePoint()
    callback()

    return Promise.resolve()
  }
}

function useFormInit() {
  return useForm<CreateAttackFormData>({
    mode: 'onChange'
  })
}

const useContext = () => {
  const useFormReturn = useFormInit()

  return {
    useFormReturn,
    submitHandle: useSubmitHandle(useFormReturn),
    isSubmitDisabled: useIsSubmitDisabled(useFormReturn),
    distance: useDistance(),
    unitTypes: useUnitTypes()
  }
}

export const [CreateAttackContextProvider, useCreateAttackContext] = constate(useContext)
