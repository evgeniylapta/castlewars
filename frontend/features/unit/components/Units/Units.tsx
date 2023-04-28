import { FC } from 'react'
import styles from './Units.module.scss'
import { useSelectedCastleDetailsContext } from '../../../castle'
import Unit from '../Unit/Unit'
import { usePreparedUnitGroups } from '../../hooks/usePreparedUnitGroups'

function useUnitGroups() {
  const { castleDetailsQuery: { data: castleDetails } } = useSelectedCastleDetailsContext()

  return usePreparedUnitGroups(castleDetails?.unitGroups)
}

const Units: FC = () => {
  const unitGroups = useUnitGroups()

  return (
    <>
      {unitGroups?.map(
        (unitGroup) => <Unit key={unitGroup.id} className={styles.unit} unitGroup={unitGroup} />
      )}
      {!unitGroups?.length && '-//-'}
    </>
  )
}

export default Units
