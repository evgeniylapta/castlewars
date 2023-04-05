import { FC, useState } from 'react'
import { ClassNameable } from '../../../../../shared/types'
import { useSelectedCastleDetailsContext } from '../../../../castle'
import Form from '../Form/Form'
import InfoSection from '../../../../../shared/components/InfoSection/InfoSection'

type Props = ClassNameable

const CreateAttack: FC<Props> = () => {
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
