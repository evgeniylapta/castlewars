import { FC, Fragment, ReactNode } from 'react'
import { Divider, List as MuiList } from '@mui/material'
import CastleInfoItem, { useIsAvailable as useIsCastleInfoAvailable } from '../listItems/CastleInfoItem/CastleInfoItem'
import GoldItem, { useIsAvailable as useIsGoldAvailable } from '../listItems/GoldItem/GoldItem'
import TroopsItem, { useIsAvailable as useIsTroopsAvailable } from '../listItems/TroopsItem/TroopsItem'
import WarStatusItem, { useIsAvailable as useIsWarStatusAvailable } from '../listItems/WarStatusItem/WarStatusItem'
import CreateAttackItem, { useIsAvailable as useIsCreateAttackAvailable } from '../listItems/CreateAttackItem/CreateAttackItem'
import TroopsOrderingItem, { useIsAvailable as useIsTroopsOrderingAvailable } from '../listItems/TroopsOrderingItem/TroopsOrderingItem'
import HistoryItem, { useIsAvailable as useIsHistoryItemAvailable } from '../listItems/HistoryItem/HistoryItem'

function useListItems(): [string, ReactNode][] {
  const map: [boolean, string, ReactNode][] = [
    [useIsCastleInfoAvailable(), 'CastleInfoItem', <CastleInfoItem />],
    [useIsGoldAvailable(), 'GoldItem', <GoldItem />],
    [useIsTroopsAvailable(), 'TroopsItem', <TroopsItem />],
    [useIsWarStatusAvailable(), 'WarStatusItem', <WarStatusItem />],
    [useIsCreateAttackAvailable(), 'CreateAttackItem', <CreateAttackItem />],
    [useIsTroopsOrderingAvailable(), 'TroopsOrderingItem', <TroopsOrderingItem />],
    [useIsHistoryItemAvailable(), 'HistoryItem', <HistoryItem />]
  ]

  return map
    .filter(([isAvailable]) => isAvailable)
    .map(([, key, component]) => [key, component])
}

const List: FC = () => (
  <MuiList>
    {useListItems().map(([key, component], index) => (
      <Fragment key={key}>
        {!!index && <Divider variant="fullWidth" />}
        {component}
      </Fragment>
    ))}
  </MuiList>
)

export default List
