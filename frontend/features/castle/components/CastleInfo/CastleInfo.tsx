import { FC, useMemo } from 'react';
import styles from './CastleInfo.module.scss';
import { TClassNameable } from '../../../../shared/types';
import { useAuthContext } from '../../../auth';
import { useSelectedCastleDetailsContext } from '../../index';
import { Tribe, TTribeType, useTribeTypesContext } from '../../../tribe';
import InfoSection from '../../../../shared/components/InfoSection/InfoSection';
import { Unit } from '../../../unit';
import { Gold } from '../../../resources';
import { AttacksStatus, CreateAttack } from '../../../attack';

type TProps = TClassNameable

const CastleInfo: FC<TProps> = ({ className}) => {
  const { currentUserQuery: { data: currentUser } } = useAuthContext()

  const { castleDetailsQuery: { data: castleDetails } } = useSelectedCastleDetailsContext()

  const { tribeTypesQuery: { data: tribeTypes } } = useTribeTypesContext()

  const tribeType: TTribeType | undefined = useMemo(
    () => tribeTypes?.find(({ id }) => id === castleDetails?.user.tribeId)?.name,
    [castleDetails, tribeTypes]
  )

  if (!castleDetails) {
    return null
  }

  return (
    <div className={className}>
      <InfoSection noMargin title="Castle">
        <div>
          User name: {castleDetails.user.name}
          {' '}
          <b>{castleDetails.user.id === currentUser?.id && ('(me)')}</b>
        </div>
        <div>Coords: [x: {castleDetails.x} y: {castleDetails.y}]</div>
      </InfoSection>

      <InfoSection title="Tribe">
        {tribeType && <Tribe type={tribeType} />}
      </InfoSection>

      <InfoSection title="Gold">
        <Gold />
      </InfoSection>

      <InfoSection title="Troops">
        <div className={styles.units}>
          {castleDetails?.unitGroups?.map((unitGroup) => <Unit key={unitGroup.id} className={styles.unit} unitGroup={unitGroup} />)}
        </div>
      </InfoSection>

      <InfoSection title="War status">
        <AttacksStatus />
      </InfoSection>

      <CreateAttack key={castleDetails.id} />
    </div>
  )
}

export default CastleInfo
