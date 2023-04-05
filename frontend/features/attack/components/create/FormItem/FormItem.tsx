import { FC } from 'react'
import { UseFormReturn } from 'react-hook-form'
import classNames from 'classnames'
import { UnitGroup, UnitTypesResponseItem, UnitIcon } from '../../../../unit'
import styles from './FormItem.module.scss'
import { ClassNameable } from '../../../../../shared/types'

function useRestValue({ watch }: UseFormReturn, fieldName: string, unitGroup?: UnitGroup) {
  if (!unitGroup) {
    return 0
  }

  const value = watch(fieldName)

  const restValue = unitGroup.amount - (value > 0 ? value : 0)

  return restValue >= 0 ? restValue : 0
}

type Props = ClassNameable & {
  unitType: UnitTypesResponseItem
  unitGroup?: UnitGroup
  useFormReturn: UseFormReturn
}

const FormItem: FC<Props> = ({
  unitGroup, unitType, className, useFormReturn
}) => {
  const name = unitType.id
  const { register, formState: { errors } } = useFormReturn
  const restValue = useRestValue(useFormReturn, name, unitGroup)

  return (
    <div className={className}>
      <UnitIcon unitTypeId={unitType.id} />
      <input
        type="number"
        {...register(name, { valueAsNumber: true, min: 0, max: restValue })}
        className={classNames(styles.input, { [styles.error]: !!errors[name] })}
      />
      <span>
        /
        {restValue}
      </span>
    </div>
  )
}

export default FormItem
