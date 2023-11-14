import { FC } from 'react'
import { UnitsList } from '../../../../entities/unit'
import { useUnitGroupsQuery } from '../../../../entities/unitGroup'
import { useCastleContext } from '../../../../entities/castle'

function useUnitGroups() {
  const { selectedCastleQuery: { data: selectedCastle } } = useCastleContext()
  const { data: unitGroups } = useUnitGroupsQuery(selectedCastle?.id)
  return unitGroups
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
