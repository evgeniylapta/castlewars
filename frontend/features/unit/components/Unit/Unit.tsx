import { FC } from 'react'
import classNames from 'classnames'
import { ClassNameable } from '../../../../shared/types'
import styles from './Unit.module.scss'
import { UnitGroup } from '../../types'
import UnitIcon from '../UnitIcon/UnitIcon'

type Props = {
  unitGroup: UnitGroup
} & ClassNameable

const Unit: FC<Props> = ({ unitGroup, className }) => {
  const { amount } = unitGroup

  return (
    <div className={classNames(className, styles.wrap)}>
      <UnitIcon unitTypeId={unitGroup.unitTypeId} />
      <span>{amount}</span>
    </div>
  )
}

export default Unit
