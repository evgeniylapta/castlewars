import { FC, useState } from 'react'
import { TClassNameable } from '../../../../../shared/types'
import { useSelectedCastleDetailsContext } from '../../../../castle'
import Form from '../Form/Form'
import InfoSection from '../../../../../shared/components/InfoSection/InfoSection'

type TProps = TClassNameable

const CreateAttack: FC<TProps> = () => {
  const { isMyCastleSelected } = useSelectedCastleDetailsContext()
  const [activated, setActivated] = useState(false)

  if (isMyCastleSelected) {
    return null
  }

  return (
    <InfoSection title="Attack this castle">
      {!activated && <button type="button" onClick={() => setActivated(true)}>Start attack</button>}
      {activated && <Form onCancel={() => setActivated(false)} />}
    </InfoSection>
  )
}

export default CreateAttack
