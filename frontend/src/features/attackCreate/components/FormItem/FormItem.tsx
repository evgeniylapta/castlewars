import { FC } from 'react'
import { UnitTypesResponseItem, UnitIcon } from '../../../../entities/unit'
import { useCreateAttackContext } from '../../contexts/createAttackContext'
import CustomTextField from '../../../../shared/components/form/CustomTextField/CustomTextField'
import { maxNumber, positiveNumberOnly } from '../../../../shared/utils/formValidationRules'
import { fieldNameByUnitType } from '../../utils/fieldNameByUnitType'
import { useMyCastleContext } from '../../../../entities/castle'
import { usePreparedUnitGroups } from '../../../../entities/unit/hooks/usePreparedUnitGroups'

function useUnitGroups() {
  const { myCastleDetailsQuery: { data: myCastleDetails } } = useMyCastleContext()

  return usePreparedUnitGroups(myCastleDetails?.unitGroups)
}

function useTroopsAmount(unitType: UnitTypesResponseItem) {
  const foundUnitGroup = useUnitGroups()?.find(({ unitTypeId }) => unitTypeId === unitType.id)

  return foundUnitGroup?.amount || 0
}

function useRestValue(unitType: UnitTypesResponseItem) {
  const { useFormReturn: { watch } } = useCreateAttackContext()

  const value = Number(watch(fieldNameByUnitType(unitType)))
  const restValue = useTroopsAmount(unitType) - (value > 0 ? value : 0)

  return restValue >= 0 ? restValue : 0
}

function useLabel(unitType: UnitTypesResponseItem) {
  return (
    <span>
      {unitType.name}
      {' '}
      (rest:
      {' '}
      {useRestValue(unitType)}
      )
    </span>
  )
}

function useIsDisabled(unitType: UnitTypesResponseItem) {
  const { useFormReturn: { watch } } = useCreateAttackContext()

  return !useRestValue(unitType) && !watch(fieldNameByUnitType(unitType))
}

type Props = {
  unitType: UnitTypesResponseItem
}
const FormItem: FC<Props> = ({ unitType }) => (
  <CustomTextField
    label={useLabel(unitType)}
    disabled={useIsDisabled(unitType)}
    fieldName={fieldNameByUnitType(unitType)}
    rules={{
      max: maxNumber(useTroopsAmount(unitType)),
      validate: positiveNumberOnly
    }}
    type="number"
    control={useCreateAttackContext().useFormReturn.control}
    startIcon={<UnitIcon unitTypeId={unitType.id} />}
  />
)

export default FormItem
