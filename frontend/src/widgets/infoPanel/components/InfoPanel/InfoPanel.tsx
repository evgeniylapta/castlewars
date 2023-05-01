import { FC } from 'react'
import { InfoPanelContextProvider } from '../../contexts/InfoPanel'
import { AttackContextProvider } from '../../../../features/attacksStatus'
import List from '../List/List'

type Props = {
  onAttackCreated: () => void
}

const InfoPanel: FC<Props> = ({ onAttackCreated }) => (
  <InfoPanelContextProvider onAttackCreated={onAttackCreated}>
    <AttackContextProvider>
      <List />
    </AttackContextProvider>
  </InfoPanelContextProvider>
)

export default InfoPanel
