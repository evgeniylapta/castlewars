import { FC, ReactNode } from 'react';
import styles from './InfoSection.module.scss';

type TProps = {
  title: string,
  children: ReactNode
}

const InfoSection: FC<TProps> = ({ children, title }) => {
  return (
    <div className={styles.section}>
      <div className={styles.title}>{title}</div>
      <div className={styles.sectionBody}>
        {children}
      </div>
    </div>
  )
}

export default InfoSection
