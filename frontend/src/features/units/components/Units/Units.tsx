import { FC } from 'react'
import { useCastleContext } from '../../../../entities/castle'
import { UnitsList, usePreparedUnitGroups } from '../../../../entities/unit'

function useUnitGroups() {
  const { selectedCastleQuery: { data } } = useCastleContext()

  return usePreparedUnitGroups(data?.unitGroups)
}

const Units: FC = () => {
  const unitGroups = useUnitGroups()

  return (
    <>
      {!!unitGroups && <UnitsList items={unitGroups} />}
      {!unitGroups?.length && '-//-'}
    </>
  )
}

export default Units
