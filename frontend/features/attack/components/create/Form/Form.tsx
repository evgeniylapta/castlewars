import { FC } from 'react';
import { useMyCastleContext, useSelectedCastleDetailsContext } from '../../../../castle';
import styles from './Form.module.scss';
import { useForm } from 'react-hook-form';
import FormItem from '../FormItem/FormItem';
import { useCreateAttackMutation } from '../../../query';
import { useMapCenterContext } from '../../../../map';

type TProps = {
  onCancel: () => void
}

const Form: FC<TProps> = ({ onCancel }) => {
  const { myCastleDetailsQuery: { data: myCastleDetails } } = useMyCastleContext()
  const { mutateAsync } = useCreateAttackMutation()
  const useFormReturn = useForm()
  const { handleSubmit, formState: { isValid }, watch } = useFormReturn
  const { castleDetailsQuery: { data: selectedCastleDetails } } = useSelectedCastleDetailsContext()
  const { goToMyCastlePoint } = useMapCenterContext()

  const isDisabled = !isValid || !Object.entries(watch()).filter(([, value]) => !!value).length

  return (
    <form onSubmit={handleSubmit(async (data) => {
      if (!selectedCastleDetails) {
        return null;
      }

      const preparedData = Object.fromEntries(Object.entries(data).filter(([,value]) => !!value))

      await mutateAsync({
        data: preparedData,
        castleId: selectedCastleDetails.id
      })

      goToMyCastlePoint()
    })}>
      {myCastleDetails?.unitGroups.map((unitGroup) => (
        <FormItem key={unitGroup.id} unitGroup={unitGroup} useFormReturn={useFormReturn} className={styles.item} />
      ))}
      <button type="submit" disabled={isDisabled} className={styles.button}>Send troops</button>
      {' '}
      <button onClick={onCancel}>Cancel</button>
    </form>
  )
}

export default Form
