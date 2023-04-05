import { FC, useMemo } from 'react'
import { ClassNameable } from '../../../../../shared/types'
import { AttackContextProvider, useAttackContext } from '../../../contexts/attackContext'
import { Attack } from '../../../types'
import { useSelectedCastleDetailsContext } from '../../../../castle'
import AttackComponent from '../Attack/Attack'
import styles from './AttacksStatus.module.scss'

function useAttacks() {
  const { attacksListQuery: { data: attacksData } } = useAttackContext()
  const { selectedCastleId } = useSelectedCastleDetailsContext()

  return useMemo(() => {
    type Result = {
      attackFromCurrentCastle: Attack[],
      attackToCurrentCastle: Attack[],
      returningAttacksOfCurrentCastle: Attack[]
    }

    const initialData: Result = {
      attackFromCurrentCastle: [],
      attackToCurrentCastle: [],
      returningAttacksOfCurrentCastle: []
    }

    return attacksData?.reduce<Result>(
      (result, attack) => {
        const attackFromCurrentCastle: Attack[] = [
          ...result.attackFromCurrentCastle,
          ...(attack.castleFromId === selectedCastleId ? [attack] : [])
        ]

        return ({
          attackFromCurrentCastle: attackFromCurrentCastle
            .filter(({ isReturning }) => !isReturning),
          attackToCurrentCastle: [
            ...result.attackToCurrentCastle,
            ...(attack.castleToId === selectedCastleId ? [attack] : [])
          ],
          returningAttacksOfCurrentCastle: [
            ...result.returningAttacksOfCurrentCastle,
            ...attackFromCurrentCastle.filter(({ isReturning }) => isReturning)
          ]
        })
      },
      initialData
    ) || initialData
  }, [selectedCastleId, attacksData])
}

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
  <AttackContextProvider>
    <AttacksStatus {...props} />
  </AttackContextProvider>
)
