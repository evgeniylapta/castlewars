import { FC, useMemo } from 'react';
import styles from './Units.module.scss';
import { useSelectedCastleDetailsContext } from '../../../castle';
import Unit from '../Unit/Unit';
import { useUnitTypesContext } from '../../contexts/unitsContext';
import { findUnitType } from '../../utils/unitTypeUtils';
import { TUnitGroup } from '../../types';

function useUnitGroups() {
  const { castleDetailsQuery: { data: castleDetails } } = useSelectedCastleDetailsContext()
  const { unitTypesQuery: { data: unitTypes } } = useUnitTypesContext()

  const sort = (unitGroups: TUnitGroup[]) => {
    const result = [...unitGroups]

    result.sort(((first, second) => {
      const firstUnitType = findUnitType(first.unitTypeId, unitTypes)
      const secondUnitType = findUnitType(second.unitTypeId, unitTypes)

      if (!firstUnitType || !secondUnitType) {
        return 0
      }

      if (firstUnitType.subsequence < secondUnitType.subsequence) {
        return -1;
      }
      if (firstUnitType.subsequence > secondUnitType.subsequence) {
        return 1;
      }
      return 0;
    }))

    return result
  }

  return useMemo(
    () => {
      if (!castleDetails?.unitGroups) {
        return undefined
      }

      return sort(castleDetails.unitGroups).filter(({ amount }) => !!amount);
    },
    [castleDetails, unitTypes]
  )
}

const Units: FC = () => {
  const unitGroups = useUnitGroups()

  return (
    <div>
      {unitGroups?.map(
        (unitGroup) => <Unit key={unitGroup.id} className={styles.unit} unitGroup={unitGroup} />
      )}
    </div>
  )
}

export default Units
