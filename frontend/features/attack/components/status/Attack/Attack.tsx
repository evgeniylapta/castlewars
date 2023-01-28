import { FC, useMemo, useState } from 'react';
import { TAttack } from '../../../types';
import styles from './Attack.module.scss';
import classNames from 'classnames';
import { TClassNameable } from '../../../../../shared/types';
import { formatDistanceStrict, isAfter } from 'date-fns';
import { useHarmonicIntervalFn } from 'react-use';

type TProps = TClassNameable & {
  attack: TAttack,
  fromCurrentCastle?: boolean
  isReturning?: boolean
}

function useCoords(attack: TAttack, fromCurrentCastle?: boolean, isReturning?: boolean) {
  return {
    x: fromCurrentCastle && !isReturning ? attack.castleTo.x : attack.castleFrom.x,
    y: fromCurrentCastle && !isReturning ? attack.castleTo.y : attack.castleFrom.y
  }
}

function useName(attack: TAttack, fromCurrentCastle?: boolean, isReturning?: boolean) {
  return fromCurrentCastle || isReturning ? attack.castleTo.user.name : attack.castleFrom.user.name
}

function useTime({ dateTime }: TAttack) {
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

const Attack: FC<TProps> = ({ attack, fromCurrentCastle, className, isReturning }) => {
  const userName = useName(attack, fromCurrentCastle, isReturning);
  const { x, y } = useCoords(attack, fromCurrentCastle, isReturning)

  const time = useTime(attack)

  return (
    <div className={className}>
      <span className={classNames(
        styles.icon,
        {
          ...(isReturning ? {
            [styles.isReturning]: isReturning,
          } : {
            [styles.fromIcon]: fromCurrentCastle,
            [styles.toIcon]: !fromCurrentCastle
          })
        }
      )}>
        {fromCurrentCastle && !isReturning ? '>>>' : '<<<'}
      </span>
      {' '}
      {isReturning ? 'Returning' : 'Attack'} {fromCurrentCastle && !isReturning ? 'to' : 'from'}
      {' '}
      {userName}
      (x: {x}, y: {y})
      {' '}
      in {time}
    </div>
  )
}

export default Attack
