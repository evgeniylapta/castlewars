import { FC } from 'react';
import { TClassNameable } from '../../../../../shared/types';
import { useAuthContext } from '../../../../auth';
import { useTribeTypeById } from '../../../../tribe';
import { useSelectedCastleDetailsContext } from '../../../../castle';
import { useUnitTypesContext } from '../../../contexts/unitsContext';

type TProps = TClassNameable

const UnitsOrder: FC<TProps> = () => {
  const { currentUserQuery: { data: currentUser } } = useAuthContext()
  const { castleDetailsQuery: { data: castleDetails } } = useSelectedCastleDetailsContext()
  const { unitTypesQuery: { data: unitTypes } } = useUnitTypesContext()

  const tribeType = useTribeTypeById(currentUser?.tribeId)

  return (
    <div>
      <button onClick={() => {}}>Order units</button>
    </div>
  )
}

export default UnitsOrder
