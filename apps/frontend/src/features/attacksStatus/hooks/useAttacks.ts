import { useMemo } from 'react'
import { useAttackContext } from '../contexts/attackContext'
import { useCastleContext } from '../../../entities/castle'
import { Attack } from '../types'

type Result = {
  attackFromCurrentCastle: Attack[],
  attackToCurrentCastle: Attack[],
  returningAttacksOfCurrentCastle: Attack[]
}

export function useAttacks() {
  const { attacksListQuery: { data: attacksData } } = useAttackContext()
  const { selectedCastleQuery: { data: selectedCastle } } = useCastleContext()

  return useMemo(() => {
    const initialData: Result = {
      attackFromCurrentCastle: [],
      attackToCurrentCastle: [],
      returningAttacksOfCurrentCastle: []
    }

    return attacksData?.reduce<Result>(
      (result, attack) => {
        const attackFromCurrentCastle: Attack[] = [
          ...result.attackFromCurrentCastle,
          ...(attack.castleFromId === selectedCastle?.id ? [attack] : [])
        ]

        return ({
          attackFromCurrentCastle: attackFromCurrentCastle
            .filter(({ isReturning }) => !isReturning),
          attackToCurrentCastle: [
            ...result.attackToCurrentCastle,
            ...(attack.castleToId === selectedCastle?.id ? [attack] : [])
          ],
          returningAttacksOfCurrentCastle: [
            ...result.returningAttacksOfCurrentCastle,
            ...attackFromCurrentCastle.filter(({ isReturning }) => isReturning)
          ]
        })
      },
      initialData
    ) || initialData
  }, [selectedCastle, attacksData])
}
