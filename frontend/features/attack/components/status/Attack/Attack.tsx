import { FC, useMemo, useState } from 'react';
import { TAttack } from '../../../types';
import styles from './Attack.module.scss';
import classNames from 'classnames';
import { TClassNameable } from '../../../../../shared/types';
import { formatDistanceStrict, isAfter } from 'date-fns';
import { useHarmonicIntervalFn } from 'react-use';

type TProps = TClassNameable & {
  attack: TAttack,
  fromCurrentCastle: boolean
}

function useCoords(attack: TAttack, fromCurrentCastle: boolean) {
  return {
    x: fromCurrentCastle ? attack.castleTo.x : attack.castleFrom.x,
    y: fromCurrentCastle ? attack.castleTo.y : attack.castleFrom.y
  }
}

function useName(attack: TAttack, fromCurrentCastle: boolean) {
  return fromCurrentCastle ? attack.castleTo.user.name : attack.castleFrom.user.name
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

const Attack: FC<TProps> = ({ attack, fromCurrentCastle, className }) => {
  const userName = useName(attack, fromCurrentCastle);
  const { x, y } = useCoords(attack, fromCurrentCastle)

  const time = useTime(attack)

  return (
    <div className={className}>
      <span className={classNames(
        styles.icon,
        {
          [styles.fromIcon]: fromCurrentCastle,
          [styles.toIcon]: !fromCurrentCastle
        }
      )}>
        {fromCurrentCastle ? '>>>' : '<<<'}
      </span>
      {' '}
      Attack {fromCurrentCastle ? 'to' : 'from'}
      {' '}
      {userName}
      (x: {x}, y: {y})
      {' '}
      in {time}
    </div>
  )
}

export default Attack
