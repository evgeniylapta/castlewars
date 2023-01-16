import { FC } from 'react';
import { TUnitGroup, UnitIcon } from '../../../../unit';
import styles from './FormItem.module.scss';
import { UseFormReturn } from 'react-hook-form';
import { TClassNameable } from '../../../../../shared/types';
import classNames from 'classnames';

function useRestValue({ watch }: UseFormReturn, unitGroup: TUnitGroup, fieldName: string) {
  const value = watch(fieldName)

  const restValue = unitGroup.amount - (value > 0 ? value : 0)

  return restValue >= 0 ? restValue : 0
}

type TProps = TClassNameable & {
  unitGroup: TUnitGroup
  useFormReturn: UseFormReturn
}

const FormItem: FC<TProps> = ({unitGroup, className, useFormReturn}) => {
  const name = unitGroup.unitTypeId
  const { register, formState: { errors } } =  useFormReturn
  const restValue = useRestValue(useFormReturn, unitGroup, name)

  return (
    <div className={className} key={unitGroup.id}>
      <UnitIcon unitGroup={unitGroup}/>
      <input
        type="number"
        {...register(name, { valueAsNumber: true, min: 0, max: unitGroup.amount })}
        className={classNames(styles.input, { [styles.error]: !!errors[name] })}
      />
      <span>/ {restValue}</span>
    </div>
  );
}

export default FormItem
