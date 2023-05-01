import { FC } from 'react'
import styles from './Units.module.scss'
import { useCastleContext } from '../../../../entities/castle'
import Unit from '../Unit/Unit'
import { usePreparedUnitGroups } from '../../../../entities/unit'

function useUnitGroups() {
  const { selectedCastleQuery: { data } } = useCastleContext()

  return usePreparedUnitGroups(data?.unitGroups)
}

const Units: FC = () => {
  const unitGroups = useUnitGroups()

  return (
    <>
      {unitGroups?.map((unitGroup) => (
        <Unit key={unitGroup.id} className={styles.unit} unitGroup={unitGroup} />
      ))}
      {!unitGroups?.length && '-//-'}
    </>
  )
}

export default Units
