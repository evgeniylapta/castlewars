import { FC } from 'react'
import classNames from 'classnames'
import { ClassNameable } from '../../../../shared/types'
import styles from './Unit.module.scss'
import UnitIcon from '../../../../entities/unit/components/UnitIcon/UnitIcon'
import { UnitGroup } from '../../../../commonTypes'

type Props = {
  unitGroup: UnitGroup
} & ClassNameable

const Unit: FC<Props> = ({ unitGroup, className }) => (
  <div className={classNames(className, styles.wrap)}>
    <UnitIcon unitTypeId={unitGroup.unitTypeId} />
    <span>{unitGroup.amount}</span>
  </div>
)

export default Unit
