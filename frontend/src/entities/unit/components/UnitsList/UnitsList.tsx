import { FC } from 'react'
import styles from './UnitsList.module.scss'
import Unit from '../Unit/Unit'
import { Uuid } from '../../../../shared/types'

type Props = {
  items: {
    unitTypeId: Uuid
    amount: number,
    id?: Uuid
  }[]
}
const UnitsList: FC<Props> = ({ items }) => (
  <div className={styles.wrap}>
    {items.map(({ unitTypeId, amount, id }) => (
      <Unit key={id || unitTypeId} unitTypeId={unitTypeId} amount={amount} />
    ))}
  </div>
)

export default UnitsList
