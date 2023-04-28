import { FC, useMemo } from 'react'
import { ClassNameable } from '../../../../../shared/types'
import { AttackContextProvider, useAttackContext } from '../../../contexts/attackContext'
import { Attack } from '../../../types'
import { useSelectedCastleDetailsContext } from '../../../../castle'
import AttackComponent from '../Attack/Attack'
import styles from './AttacksStatus.module.scss'
import { useAttacks } from '../../../hooks/useAttacks'

type Props = ClassNameable

const AttacksStatus: FC<Props> = () => {
  const {
    attackFromCurrentCastle,
    attackToCurrentCastle,
    returningAttacksOfCurrentCastle
  } = useAttacks()

  if (!attackFromCurrentCastle.length && !attackToCurrentCastle.length) {
    return null
  }

  return (
    <>
      {attackFromCurrentCastle.map((attack) => (
        <AttackComponent
          className={styles.item}
          key={attack.id}
          attack={attack}
          fromCurrentCastle
        />
      ))}
      {attackToCurrentCastle.map((attack) => (
        <AttackComponent
          className={styles.item}
          key={attack.id}
          attack={attack}
          fromCurrentCastle={false}
        />
      ))}
      {returningAttacksOfCurrentCastle.map((attack) => (
        <AttackComponent
          className={styles.item}
          key={attack.id}
          attack={attack}
          isReturning
        />
      ))}
    </>
  )
}

export default ({ ...props }: Props) => (
  <AttacksStatus {...props} />
)
