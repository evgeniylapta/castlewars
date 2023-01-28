import { FC, useMemo } from 'react';
import { TClassNameable } from '../../../../../shared/types';
import { AttackContextProvider, useAttackContext } from '../../../contexts/attackContext';
import { TAttack } from '../../../types';
import { useSelectedCastleDetailsContext } from '../../../../castle';
import Attack from '../Attack/Attack';
import styles from './AttacksStatus.module.scss';

function getAttacks() {
  const { attacksListQuery: { data: attacksData } } = useAttackContext()
  const { selectedCastleId } = useSelectedCastleDetailsContext()

  return useMemo(() => {
    type TResult = {
      attackFromCurrentCastle: TAttack[],
      attackToCurrentCastle: TAttack[],
      returningAttacksOfCurrentCastle: TAttack[]
    }

    const initialData: TResult = { attackFromCurrentCastle: [], attackToCurrentCastle: [], returningAttacksOfCurrentCastle: [] }


    return attacksData?.reduce<TResult>(
      (result, attack) => {
        const attackFromCurrentCastle: TAttack[] = [
          ...result.attackFromCurrentCastle,
          ...(attack.castleFromId === selectedCastleId ? [attack] : [])
        ]

        return ({
          attackFromCurrentCastle: attackFromCurrentCastle.filter(({ isReturning }) => !isReturning),
          attackToCurrentCastle: [...result.attackToCurrentCastle, ...(attack.castleToId === selectedCastleId ? [attack] : [])],
          returningAttacksOfCurrentCastle: [...result.returningAttacksOfCurrentCastle, ...attackFromCurrentCastle.filter(({ isReturning }) => isReturning)]
        });
      },
      initialData
    ) || initialData
  }, [selectedCastleId, attacksData])
}

type TProps = TClassNameable

const AttacksStatus: FC<TProps> = () => {
  const { attackFromCurrentCastle, attackToCurrentCastle, returningAttacksOfCurrentCastle } = getAttacks()

  if (!attackFromCurrentCastle.length && !attackToCurrentCastle.length) {
    return null
  }

  return (
    <>
      {attackFromCurrentCastle.map((attack) => <Attack className={styles.item} key={attack.id} attack={attack} fromCurrentCastle={true} />)}
      {attackToCurrentCastle.map((attack) => <Attack className={styles.item} key={attack.id} attack={attack} fromCurrentCastle={false} />)}
      {returningAttacksOfCurrentCastle.map((attack) => <Attack className={styles.item} key={attack.id} attack={attack} isReturning />)}
    </>
  )
}

export default ({...props}: TProps) => (
  <AttackContextProvider>
    <AttacksStatus {...props} />
  </AttackContextProvider>
)
