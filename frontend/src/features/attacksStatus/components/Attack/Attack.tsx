import { FC, useMemo, useState } from 'react'
import { formatDistanceStrict, isAfter } from 'date-fns'
import { useHarmonicIntervalFn } from 'react-use'
import { Attack as AttackType } from '../../types'
import { ClassNameable } from '../../../../shared/types'
import { AttackIcon } from '../../../../entities/attack'

type Props = ClassNameable & {
  attack: AttackType,
  fromCurrentCastle?: boolean
  isReturning?: boolean
}

function useCoords(attack: AttackType, fromCurrentCastle?: boolean, isReturning?: boolean) {
  return {
    x: fromCurrentCastle && !isReturning ? attack.castleTo.x : attack.castleFrom.x,
    y: fromCurrentCastle && !isReturning ? attack.castleTo.y : attack.castleFrom.y
  }
}

function useName(attack: AttackType, fromCurrentCastle?: boolean, isReturning?: boolean) {
  return fromCurrentCastle || isReturning ? attack.castleTo.user.name : attack.castleFrom.user.name
}

function useTime({ dateTime }: AttackType) {
  const [attacksTimerTickTime, setAttacksTimerTickTime] = useState<Date>()

  useHarmonicIntervalFn(
    () => setAttacksTimerTickTime(new Date()),
    1000
  )

  return useMemo(
    () => {
      const date = new Date(dateTime)
      const currentTime = attacksTimerTickTime || new Date()

      const dateToCompare = isAfter(currentTime, date) ? date : currentTime

      return formatDistanceStrict(
        date,
        dateToCompare
      )
    },
    [attacksTimerTickTime, dateTime]
  )
}

const Attack: FC<Props> = ({
  attack,
  fromCurrentCastle,
  className,
  isReturning
}) => {
  const userName = useName(attack, fromCurrentCastle, isReturning)
  const { x, y } = useCoords(attack, fromCurrentCastle, isReturning)

  const time = useTime(attack)

  return (
    <div className={className}>
      <AttackIcon
        flickering
        isFrom={fromCurrentCastle}
        isReturning={isReturning}
      />
      {' '}
      {isReturning ? 'Returning' : 'Attack'}
      {' '}
      {fromCurrentCastle && !isReturning ? 'to' : 'from'}
      {' '}
      {userName}
      (x:
      {' '}
      {x}
      , y:
      {' '}
      {y}
      )
      {' '}
      in
      {' '}
      {time}
    </div>
  )
}

export default Attack
