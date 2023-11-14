import constate from 'constate'

type Props = {
  onAttackCreated?: () => void
}
const useContext = (props: Props) => props

export const [InfoPanelContextProvider, useInfoPanelContext] = constate(useContext)
