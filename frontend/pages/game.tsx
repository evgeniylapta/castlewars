import { Paper } from '@mui/material'
import { FC, useRef } from 'react'
import type { NextPageWithLayout } from './_app'
import { Map, MapRefProps } from '../src/features/map'
import { InfoPanel } from '../src/widgets/infoPanel'
import { TribeTypesContextProvider } from '../src/entities/tribe'
import { UnitTypesContextProvider } from '../src/entities/unit'
import { SocketsContextProvider } from '../src/shared'
import { CastleProvider, useCastleContext } from '../src/entities/castle'
import styles from './game.module.scss'
import { useAuthData } from '../src/entities/auth'

const GamePageContent: NextPageWithLayout = () => {
  const { myCastleQuery: { isFetched } } = useCastleContext()
  const mapRef = useRef<MapRefProps>(null)

  if (!isFetched) {
    return null
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.mapWrap}>
        <Paper elevation={3}>
          <Map ref={mapRef} />
        </Paper>
      </div>
      <div>
        <div className={styles.infoWrap}>
          <Paper elevation={3}>
            <InfoPanel onAttackCreated={() => mapRef.current?.goToMyCastlePoint()} />
          </Paper>
        </div>
      </div>
    </div>
  )
}

const GamePage: FC = () => (
  <TribeTypesContextProvider>
    <UnitTypesContextProvider>
      <SocketsContextProvider>
        <CastleProvider myCastleId={useAuthData()?.castleId}>
          <GamePageContent />
        </CastleProvider>
      </SocketsContextProvider>
    </UnitTypesContextProvider>
  </TribeTypesContextProvider>
)

export default GamePage
