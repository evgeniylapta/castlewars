import { FC, ReactNode } from 'react'
import classNames from 'classnames'
import styles from './InfoSection.module.scss'

type Props = {
  noMargin?: boolean,
  title?: string,
  children: ReactNode
}

const InfoSection: FC<Props> = ({ children, title, noMargin }) => (
  <div className={classNames(styles.section, { [styles.noMargin]: noMargin })}>
    <div className={styles.title}>{title}</div>
    <div className={styles.sectionBody}>
      {children}
    </div>
  </div>
)

export default InfoSection
