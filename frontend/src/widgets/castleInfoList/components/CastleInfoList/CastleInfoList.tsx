import { FC } from 'react'
import { Divider, List } from '@mui/material'
import CastleInfoItem, { useIsAvailable as useIsCastleInfoAvailable } from '../listItems/CastleInfoItem/CastleInfoItem'
import GoldItem, { useIsAvailable as useIsGoldAvailable } from '../listItems/GoldItem/GoldItem'
import TroopsItem, { useIsAvailable as useIsTroopsAvailable } from '../listItems/TroopsItem/TroopsItem'
import WarStatusItem, { useIsAvailable as useIsWarStatusAvailable } from '../listItems/WarStatusItem/WarStatusItem'
import CreateAttackItem, { useIsAvailable as useIsCreateAttackAvailable } from '../listItems/CreateAttackItem/CreateAttackItem'
import TroopsOrderingItem, { useIsAvailable as useIsTroopsOrderingAvailable } from '../listItems/TroopsOrderingItem/TroopsOrderingItem'
import HistoryItem, { useIsAvailable as useIsHistoryItemAvailable } from '../listItems/HistoryItem/HistoryItem'

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
