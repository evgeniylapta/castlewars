import { FC } from 'react'
import { UnitTypesResponseItem, UnitIcon } from '../../../index'
import { useUnitsOrderFormContext } from '../../../contexts/unitsOrderFormContext'
import { positiveNumberOnly } from '../../../../../shared/utils/formValidationRules'
import CustomTextField from '../../../../../shared/components/form/CustomTextField/CustomTextField'

type Props = {
  unitType: UnitTypesResponseItem
}

const FormItem: FC<Props> = ({ unitType }) => (
  <CustomTextField
    label={unitType.name}
    fieldName={unitType.id}
    rules={{
      validate: positiveNumberOnly
    }}
    type="number"
    control={useUnitsOrderFormContext().useFormReturn.control}
    startIcon={<UnitIcon unitTypeId={unitType.id} />}
  />
)

export default FormItem
