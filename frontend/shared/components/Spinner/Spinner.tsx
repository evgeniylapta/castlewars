import { FC } from 'react';
import styles from './Spinner.module.scss';
import { TClassNameable } from '../../types';
import classNames from 'classnames';

const Spinner: FC<TClassNameable> = ({ className }) => {
  return (
    <div className={classNames(styles.ldsRing, className)}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

export default Spinner
