import { FC } from 'react';
import InfoSection from '../../../../shared/components/InfoSection/InfoSection';
import { TClassNameable } from '../../../../shared/types';
import { useCastleDetailsContext } from '../../../castle';

type TProps = TClassNameable

const CreateAttack: FC<TProps> = () => {
  const { isMyCastleSelected } = useCastleDetailsContext()

  if (isMyCastleSelected) {
    return null
  }

  return (
    <InfoSection>
      <button type="button">Send troops</button>
    </InfoSection>
  )
}

export default CreateAttack
