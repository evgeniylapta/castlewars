import { useAttacks } from './useAttacks'

export function useHasActiveAttacksStatus() {
  const {
    attackFromCurrentCastle,
    attackToCurrentCastle,
    returningAttacksOfCurrentCastle
  } = useAttacks()

  return !!attackFromCurrentCastle.length
    || !!attackToCurrentCastle.length
    || !!returningAttacksOfCurrentCastle.length
}
