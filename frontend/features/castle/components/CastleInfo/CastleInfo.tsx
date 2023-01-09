import { FC, useMemo } from 'react';
import styles from './CastleInfo.module.scss';
import { TClassNameable } from '../../../../shared/types';
import goldImg from '../../assets/gold.png';
import { useAuthContext } from '../../../auth';
import { useCastleDetailsContext } from '../../index';
import { Tribe, TTribeType, useTribeTypesContext } from '../../../tribe';
import InfoSection from '../../../../shared/components/InfoSection/InfoSection';
import { Unit } from '../../../unit';

type TProps = TClassNameable

const CastleInfo: FC<TProps> = ({ className}) => {
  const { userData: { id: userId } } = useAuthContext()

  const { castleDetailsQuery: { data: castleDetails } } = useCastleDetailsContext()

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
      <InfoSection title="Castle">
        <div>
          User name: {castleDetails.user.name}
          {' '}
          <b>{castleDetails.user.id === userId && ('(me)')}</b>
        </div>
        <div>Coords: x: {castleDetails.x} y: {castleDetails.y}</div>
      </InfoSection>

      <InfoSection title="Tribe">
        {tribeType && <Tribe type={tribeType} />}
      </InfoSection>

      <InfoSection title="Gold">
        <div className={styles.goldWrap}>
          <img className={styles.gold} src={goldImg.src} alt=""/>
          <span>{castleDetails?.castleResources?.gold}</span>
        </div>
      </InfoSection>

      <InfoSection title="Troops">
        <div className={styles.units}>
          {castleDetails?.unitGroups?.map((unitGroup) => <Unit className={styles.unit} unitGroup={unitGroup} />)}
        </div>
      </InfoSection>
    </div>
  )
}

export default CastleInfo
