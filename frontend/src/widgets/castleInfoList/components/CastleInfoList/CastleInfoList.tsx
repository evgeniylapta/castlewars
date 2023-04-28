import { FC } from 'react'
import { Divider, List } from '@mui/material'
import CastleInfoItem, { useIsAvailable as useIsCastleInfoAvailable } from '../../../../entities/castle/components/listItems/CastleInfoItem/CastleInfoItem'
import GoldItem, { useIsAvailable as useIsGoldAvailable } from '../../../../entities/castle/components/listItems/GoldItem/GoldItem'
import TroopsItem, { useIsAvailable as useIsTroopsAvailable } from '../../../../entities/castle/components/listItems/TroopsItem/TroopsItem'
import WarStatusItem, { useIsAvailable as useIsWarStatusAvailable } from '../../../../entities/castle/components/listItems/WarStatusItem/WarStatusItem'
import CreateAttackItem, { useIsAvailable as useIsCreateAttackAvailable } from '../../../../entities/castle/components/listItems/CreateAttackItem/CreateAttackItem'
import TroopsOrderingItem, { useIsAvailable as useIsTroopsOrderingAvailable } from '../../../../entities/castle/components/listItems/TroopsOrderingItem/TroopsOrderingItem'
import HistoryItem, { useIsAvailable as useIsHistoryItemAvailable } from '../../../../entities/castle/components/listItems/HistoryItem/HistoryItem'

function useListItems() {
  return [
    [useIsCastleInfoAvailable(), <CastleInfoItem />],
    [useIsGoldAvailable(), <GoldItem />],
    [useIsTroopsAvailable(), <TroopsItem />],
    [useIsWarStatusAvailable(), <WarStatusItem />],
    [useIsCreateAttackAvailable(), <CreateAttackItem />],
    [useIsTroopsOrderingAvailable(), <TroopsOrderingItem />],
    [useIsHistoryItemAvailable(), <HistoryItem />]
  ]
    .filter(([isAvailable]) => isAvailable)
    .map(([, component]) => component)
}

const CastleInfoList: FC = () => (
  <List>
    {useListItems().map((component, index) => (
      <>
        {!!index && <Divider variant="fullWidth" />}
        {component}
      </>
    ))}
  </List>
)

export default CastleInfoList
