import { FC, useMemo } from 'react';
import InfoSection from '../../../../shared/components/InfoSection/InfoSection';
import { TClassNameable } from '../../../../shared/types';
import { AttackContextProvider, useAttackContext } from '../../contexts/attackContext';
import { TAttack } from '../../types';
import { useCastleDetailsContext } from '../../../castle';
import Attack from '../Attack/Attack';
import styles from './WarStatus.module.scss';

function getAttacks() {
  const { attacksListQuery: { data: attacksData } } = useAttackContext()
  const { selectedCastleId } = useCastleDetailsContext()

  return useMemo(() => {
    const initialData = { attackFromCastle: [], attackToCastle: [] }

    return attacksData?.reduce<{ attackFromCastle: TAttack[], attackToCastle: TAttack[] }>(
      (result, attack) => ({
        attackFromCastle: [...result.attackFromCastle, ...(attack.castleFromId === selectedCastleId ? [attack] : [])],
        attackToCastle: [...result.attackToCastle, ...(attack.castleToId === selectedCastleId ? [attack] : [])]
      }),
      initialData
    ) || initialData
  }, [selectedCastleId, attacksData])
}

type TProps = TClassNameable

const WarStatus: FC<TProps> = () => {
  const { attackFromCastle, attackToCastle } = getAttacks()

  if (!attackFromCastle.length && !attackToCastle.length) {
    return null
  }

  return (
    <InfoSection title="War status">
      {attackFromCastle.map((attack) => <Attack className={styles.item} key={attack.id} attack={attack} fromCurrentCastle={false} />)}
      {attackToCastle.map((attack) => <Attack className={styles.item} key={attack.id} attack={attack} fromCurrentCastle={true} />)}
    </InfoSection>
  )
}

export default ({...props}: TProps) => (
  <AttackContextProvider>
    <WarStatus {...props} />
  </AttackContextProvider>
)
