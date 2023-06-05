import { FC } from 'react'
import classNames from 'classnames'
import styles from './AttackIcon.module.scss'

type Props = {
  isFrom?: boolean
  isReturning?: boolean
  flickering?: boolean
}

const AttackIcon: FC<Props> = ({
  isFrom,
  isReturning,
  flickering
}) => (
  <span className={classNames(
    styles.icon,
    {
      ...(isReturning ? {
        [styles.isReturning]: isReturning
      } : {
        [styles.fromIcon]: isFrom,
        [styles.toIcon]: !isFrom
      }),
      [styles.animation]: flickering
    }
  )}
  >
    {isFrom && !isReturning ? '>>>' : '<<<'}
  </span>
)

export default AttackIcon
