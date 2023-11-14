import { FC } from 'react'
import { ClassNameable, Uuid } from '../../../../shared'
import styles from './Unit.module.scss'
import UnitIcon from '../UnitIcon/UnitIcon'

type Props = {
  unitTypeId: Uuid
  amount: number
} & ClassNameable

const Unit: FC<Props> = ({ unitTypeId, amount }) => (
  <div className={styles.wrap}>
    <UnitIcon unitTypeId={unitTypeId} />
    <span>{amount}</span>
  </div>
)

export default Unit
