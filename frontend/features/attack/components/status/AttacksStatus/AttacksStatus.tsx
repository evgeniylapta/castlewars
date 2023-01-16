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
    const initialData = { attackFromCurrentCastle: [], attackToCurrentCastle: [] }

    return attacksData?.reduce<{ attackFromCurrentCastle: TAttack[], attackToCurrentCastle: TAttack[] }>(
      (result, attack) => ({
        attackFromCurrentCastle: [...result.attackFromCurrentCastle, ...(attack.castleFromId === selectedCastleId ? [attack] : [])],
        attackToCurrentCastle: [...result.attackToCurrentCastle, ...(attack.castleToId === selectedCastleId ? [attack] : [])]
      }),
      initialData
    ) || initialData
  }, [selectedCastleId, attacksData])
}

type TProps = TClassNameable

const AttacksStatus: FC<TProps> = () => {
  const { attackFromCurrentCastle, attackToCurrentCastle } = getAttacks()

  if (!attackFromCurrentCastle.length && !attackToCurrentCastle.length) {
    return null
  }

  return (
    <>
      {attackFromCurrentCastle.map((attack) => <Attack className={styles.item} key={attack.id} attack={attack} fromCurrentCastle={true} />)}
      {attackToCurrentCastle.map((attack) => <Attack className={styles.item} key={attack.id} attack={attack} fromCurrentCastle={false} />)}
    </>
  )
}

export default ({...props}: TProps) => (
  <AttackContextProvider>
    <AttacksStatus {...props} />
  </AttackContextProvider>
)
