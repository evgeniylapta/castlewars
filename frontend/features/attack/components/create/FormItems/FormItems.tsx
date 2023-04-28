import { FC } from 'react'
import FormItem from '../FormItem/FormItem'
import styles from './FormItems.module.scss'
import { useCreateAttackContext } from '../../../contexts/createAttackContext'

const FormItems: FC = () => (
  <div>
    {useCreateAttackContext().unitTypes?.map((unitType) => (
      <div key={unitType.id} className={styles.item}>
        <FormItem unitType={unitType} />
      </div>
    ))}
  </div>
)

export default FormItems
