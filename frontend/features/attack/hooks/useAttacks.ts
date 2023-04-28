import { useMemo } from 'react'
import { useAttackContext } from '../contexts/attackContext'
import { useSelectedCastleDetailsContext } from '../../castle'
import { Attack } from '../types'

export function useAttacks() {
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