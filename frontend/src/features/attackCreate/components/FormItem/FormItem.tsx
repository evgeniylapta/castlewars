import { FC } from 'react'
import { useCreateAttackContext } from '../../contexts/createAttackContext'
import CustomTextField from '../../../../shared/components/form/CustomTextField/CustomTextField'
import { maxNumber, positiveNumberOnly } from '../../../../shared/utils/formValidationRules'
import { fieldNameByUnitType } from '../../utils/fieldNameByUnitType'
import { UnitIcon } from '../../../../entities/unit'
import { UnitType } from '../../../../commonTypes'
import { useUnitGroupsQuery } from '../../../../entities/unitGroup'
import { useCastleContext } from '../../../../entities/castle'

function useTroopsAmount(unitType: UnitType) {
  const { data: unitGroups } = useUnitGroupsQuery(useCastleContext().myCastleQuery.data?.id)
  const foundUnitGroup = unitGroups?.find(({ unitTypeId }) => unitTypeId === unitType.id)
  return foundUnitGroup?.amount || 0
}

function useRestValue(unitType: UnitType) {
  const { useFormReturn: { watch } } = useCreateAttackContext()

  const value = Number(watch(fieldNameByUnitType(unitType)))
  const restValue = useTroopsAmount(unitType) - (value > 0 ? value : 0)

  return restValue >= 0 ? restValue : 0
}

function useLabel(unitType: UnitType) {
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

function useIsDisabled(unitType: UnitType) {
  const { useFormReturn: { watch } } = useCreateAttackContext()

  return !useRestValue(unitType) && !watch(fieldNameByUnitType(unitType))
}

type Props = {
  unitType: UnitType
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
