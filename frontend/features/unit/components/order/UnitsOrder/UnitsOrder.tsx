import { FC, useState } from 'react'
import { ClassNameable } from '../../../../../shared/types'
import Form from '../Form/Form'

type Props = ClassNameable

const UnitsOrder: FC<Props> = () => {
  const [activated, setActivated] = useState(false)

  return (
    <div>
      {!activated && <button type="button" onClick={() => setActivated(true)}>Select troops to order</button>}
      {activated && <Form onCancel={() => setActivated(false)} />}
    </div>
  )
}

export default UnitsOrder
