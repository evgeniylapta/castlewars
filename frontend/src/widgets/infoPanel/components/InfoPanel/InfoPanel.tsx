import { FC } from 'react'
import { InfoPanelContextProvider } from '../../contexts/InfoPanel'
import { AttackContextProvider } from '../../../../features/attacksStatus'
import List from '../List/List'
import { UnitsOrderStatusContextProvider } from '../../../../features/unitsOrderStatus'

type Props = {
  onAttackCreated: () => void
}

const InfoPanel: FC<Props> = ({ onAttackCreated }) => (
  <InfoPanelContextProvider onAttackCreated={onAttackCreated}>
    <AttackContextProvider>
      <UnitsOrderStatusContextProvider>
        <List />
      </UnitsOrderStatusContextProvider>
    </AttackContextProvider>
  </InfoPanelContextProvider>
)

export default InfoPanel
