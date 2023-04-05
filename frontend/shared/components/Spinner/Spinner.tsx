import { FC } from 'react'
import classNames from 'classnames'
import styles from './Spinner.module.scss'
import { ClassNameable } from '../../types'

const Spinner: FC<ClassNameable> = ({ className }) => (
  <div className={classNames(styles.ldsRing, className)}>
    <div />
    <div />
    <div />
    <div />
  </div>
)

export default Spinner
