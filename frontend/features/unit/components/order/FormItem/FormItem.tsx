import { FC } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { UnitTypesResponseItem, UnitIcon } from '../../../../unit'
import styles from './FormItem.module.scss'
import { ClassNameable } from '../../../../../shared/types'

type Props = ClassNameable & {
  unitType: UnitTypesResponseItem
  useFormReturn: UseFormReturn
}

const FormItem: FC<Props> = ({ unitType, className, useFormReturn }) => {
  const name = unitType.id
  const { register } = useFormReturn

  return (
    <div className={className}>
      <UnitIcon unitTypeId={unitType.id} />
      <input
        type="number"
        {...register(name, { valueAsNumber: true, min: 0 })}
        className={styles.input}
      />
    </div>
  )
}

export default FormItem
