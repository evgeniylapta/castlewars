import { FC } from 'react'
import classNames from 'classnames'
import styles from './Spinner.module.scss'
import { TClassNameable } from '../../types'

const Spinner: FC<TClassNameable> = ({ className }) => (
  <div className={classNames(styles.ldsRing, className)}>
    <div />
    <div />
    <div />
    <div />
  </div>
)

export default Spinner
