import { FC } from 'react'
import classNames from 'classnames'
import { TClassNameable } from '../../../../shared/types'
import styles from './Unit.module.scss'
import { TUnitGroup } from '../../types'
import UnitIcon from '../UnitIcon/UnitIcon'

type TProps = {
  unitGroup: TUnitGroup
} & TClassNameable

const Unit: FC<TProps> = ({ unitGroup, className }) => {
  const { amount } = unitGroup

  return (
    <div className={classNames(className, styles.wrap)}>
      <UnitIcon unitTypeId={unitGroup.unitTypeId} />
      <span>{amount}</span>
    </div>
  )
}

export default Unit
