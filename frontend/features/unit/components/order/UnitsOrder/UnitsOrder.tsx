import { FC, useState } from 'react';
import { TClassNameable } from '../../../../../shared/types';
import Form from '../Form/Form';
import { useUnitTypesByTribeId } from '../../../hooks/useUnitTypesByTribeId';

type TProps = TClassNameable

const UnitsOrder: FC<TProps> = () => {
  const [activated, setActivated] = useState(false)

  return (
    <div>
      {!activated && <button type="button" onClick={() => setActivated(true)}>Select troops to order</button>}
      {activated && <Form onCancel={() => setActivated(false)} />}
    </div>
  )
}

export default UnitsOrder
