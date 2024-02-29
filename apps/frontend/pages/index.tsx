import { Paper } from '@mui/material'
import { useRef } from 'react'
import type { NextPageExtended } from './_app'
import { MapRefProps, Map } from '../src/features/map'
import { TribeTypesContextProvider } from '../src/entities/tribe'
import { UnitTypesContextProvider } from '../src/entities/unit'
import { SocketsContextProvider } from '../src/shared'
import { CastleProvider, useCastleContext } from '../src/entities/castle'
import styles from './index.module.scss'
import { useUserDataContext } from '../src/entities/auth'
import { InfoPanel } from '../src/widgets/infoPanel'

const GamePageContent: NextPageExtended = () => {
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

const HomePage: NextPageExtended = () => (
  <TribeTypesContextProvider>
    <UnitTypesContextProvider>
      <CastleProvider myCastleId={useUserDataContext().myUserQuery?.data?.castleId}>
        <GamePageContent />
      </CastleProvider>
    </UnitTypesContextProvider>
  </TribeTypesContextProvider>
)

HomePage.onlyAuthenticated = true

export default HomePage
