import { FC } from 'react';
import { TUnitGroup, TUnitTypesResponseItem, UnitIcon } from '../../../../unit';
import styles from './FormItem.module.scss';
import { UseFormReturn } from 'react-hook-form';
import { TClassNameable } from '../../../../../shared/types';
import classNames from 'classnames';

function useRestValue({ watch }: UseFormReturn, fieldName: string, unitGroup?: TUnitGroup) {
  if (!unitGroup) {
    return 0
  }

  const value = watch(fieldName)

  const restValue = unitGroup.amount - (value > 0 ? value : 0)

  return restValue >= 0 ? restValue : 0
}

type TProps = TClassNameable & {
  unitType: TUnitTypesResponseItem
  unitGroup?: TUnitGroup
  useFormReturn: UseFormReturn
}

const FormItem: FC<TProps> = ({unitGroup, unitType, className, useFormReturn}) => {
  const name = unitType.id
  const { register, formState: { errors } } = useFormReturn
  const restValue = useRestValue(useFormReturn, name, unitGroup)

  return (
    <div className={className}>
      <UnitIcon unitTypeId={unitType.id}/>
      <input
        type="number"
        {...register(name, { valueAsNumber: true, min: 0, max: restValue })}
        className={classNames(styles.input, { [styles.error]: !!errors[name] })}
      />
      <span>/ {restValue}</span>
    </div>
  );
}

export default FormItem
