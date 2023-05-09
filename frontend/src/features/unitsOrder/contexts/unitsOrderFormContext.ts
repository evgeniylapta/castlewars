import constate from 'constate'
import { useForm, UseFormReturn } from 'react-hook-form'
import { useMemo } from 'react'
import { useUnitTypesContext, findUnitTypeById } from '../../../entities/unit'
import { useCalculatedGoldInterval } from '../../../entities/gold'
import { useCastleContext } from '../../../entities/castle'
import { useUnitsOrderMutation } from '../query'
import { OrderUnitsFormData } from '../types'

function useSubmitHandle({ getValues }: UseFormReturn<OrderUnitsFormData>) {
  const { myCastleQuery: { data: myCastleData } } = useCastleContext()
  const { mutateAsync } = useUnitsOrderMutation()

  return async (callback: () => void) => {
    if (!myCastleData) {
      return
    }

    await mutateAsync({ castleId: myCastleData.id, data: getValues() })

    callback()
  }
}

export function useTroopsTotalPrice({ watch }: UseFormReturn<OrderUnitsFormData>) {
  const { unitTypesQuery: { data: unitTypes } } = useUnitTypesContext()

  const formData = watch()

  return useMemo(
    () => Object.entries(formData)
      .filter(([, amount]) => !!amount && Number(amount) > 0)
      .reduce((result, [unitTypeId, amount]) => {
        const price = findUnitTypeById(unitTypeId, unitTypes)?.goldPrice
        return price ? (price * Number(amount)) + result : result
      }, 0),
    [formData, unitTypes]
  )
}

function useTroopsTotal(useFormReturn: UseFormReturn<OrderUnitsFormData>) {
  const { myCastleQuery: { data } } = useCastleContext()
  const calculatedGold = useCalculatedGoldInterval(
    data?.castleResources.gold,
    data?.castleResources.goldLastUpdate
  )

  const troopsTotalPrice = useTroopsTotalPrice(useFormReturn)

  return {
    availableGold: calculatedGold,
    troopsTotalPrice,
    notEnoughGold: !!calculatedGold && troopsTotalPrice > calculatedGold
  }
}

function useFormInit() {
  return useForm<OrderUnitsFormData>({ mode: 'onChange' })
}

const useContext = () => {
  const useFormReturn = useFormInit()

  return ({
    useFormReturn,
    submitHandle: useSubmitHandle(useFormReturn),
    troopsTotal: useTroopsTotal(useFormReturn)
  })
}

export const [UnitsOrderFormContextProvider, useUnitsOrderFormContext] = constate(useContext)
