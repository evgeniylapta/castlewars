import { FC } from 'react';
import { TAttack } from '../../types';
import styles from './Attack.module.scss';
import classNames from 'classnames';
import { TClassNameable } from '../../../../shared/types';

type TProps = TClassNameable & {
  attack: TAttack,
  fromCurrentCastle: boolean
}

const Attack: FC<TProps> = ({ attack, fromCurrentCastle, className }) => {
  const userName = fromCurrentCastle ? attack.castleFrom.user.name : attack.castleTo.user.name;
  const coordX = fromCurrentCastle ? attack.castleFrom.x : attack.castleTo.x
  const coordY = fromCurrentCastle ? attack.castleFrom.y : attack.castleTo.y

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
      {userName}
      {' '}
      [x: {coordX}, y: {coordY}]
    </div>
  )
}

export default Attack
