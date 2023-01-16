import { FC, ReactNode } from 'react';
import styles from './InfoSection.module.scss';
import classNames from 'classnames';

type TProps = {
  noMargin?: boolean,
  title?: string,
  children: ReactNode
}

const InfoSection: FC<TProps> = ({ children, title, noMargin }) => {
  return (
    <div className={classNames(styles.section, { [styles.noMargin]: noMargin })}>
      <div className={styles.title}>{title}</div>
      <div className={styles.sectionBody}>
        {children}
      </div>
    </div>
  )
}

export default InfoSection
