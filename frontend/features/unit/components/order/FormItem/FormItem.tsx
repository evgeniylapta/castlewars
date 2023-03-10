import { FC } from 'react';
import { TUnitGroup, TUnitTypesResponseItem, UnitIcon } from '../../../../unit';
import styles from './FormItem.module.scss';
import { UseFormReturn } from 'react-hook-form';
import { TClassNameable } from '../../../../../shared/types';

type TProps = TClassNameable & {
  unitType: TUnitTypesResponseItem
  useFormReturn: UseFormReturn
}

const FormItem: FC<TProps> = ({unitType, className, useFormReturn}) => {
  const name = unitType.id
  const { register } =  useFormReturn

  return (
    <div className={className}>
      <UnitIcon unitTypeId={unitType.id}/>
      <input
        type="number"
        {...register(name, { valueAsNumber: true, min: 0 })}
        className={styles.input}
      />
    </div>
  );
}

export default FormItem
