import { FC } from 'react'
import Attack from '../Attack/Attack'
import styles from './AttacksStatus.module.scss'
import { useAttacks } from '../../../hooks/useAttacks'

const AttacksStatus: FC = () => (
  <>
    {useAttacks().attackFromCurrentCastle.map((attack) => (
      <Attack
        className={styles.item}
        key={attack.id}
        attack={attack}
        fromCurrentCastle
      />
    ))}
    {useAttacks().attackToCurrentCastle.map((attack) => (
      <Attack
        className={styles.item}
        key={attack.id}
        attack={attack}
        fromCurrentCastle={false}
      />
    ))}
    {useAttacks().returningAttacksOfCurrentCastle.map((attack) => (
      <Attack
        className={styles.item}
        key={attack.id}
        attack={attack}
        isReturning
      />
    ))}
  </>
)

export default AttacksStatus
