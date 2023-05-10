import { Paper } from '@mui/material'
import { FC, useRef } from 'react'
import styles from './Index.module.scss'
import { useUserContext } from '../src/entities/user'
import { Map, MapRefProps } from '../src/features/map'
import { TribeTypesContextProvider } from '../src/entities/tribe'
import { UnitTypesContextProvider } from '../src/entities/unit'
import { InfoPanel } from '../src/widgets/infoPanel'
import { Header } from '../src/widgets/header'
import { CastleProvider, useCastleContext } from '../src/entities/castle'
import { SocketsContextProvider } from '../src/shared/contexts/socketsContext'

const Home: FC = () => {
  const { myCastleQuery: { isFetched } } = useCastleContext()
  const mapRef = useRef<MapRefProps>(null)

  if (!isFetched) {
    return null
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.mapWrap}>
          <Paper elevation={3}>
            <Map ref={mapRef} />
          </Paper>
        </div>
        <div className={styles.infoWrap}>
          <Paper elevation={3}>
            <InfoPanel onAttackCreated={() => mapRef.current?.goToMyCastlePoint()} />
          </Paper>
        </div>
      </div>
    </>
  )
}

export default function () {
  const { currentUserQuery: { data: currentUser } } = useUserContext()

  return (
    <TribeTypesContextProvider>
      <UnitTypesContextProvider>
        <SocketsContextProvider>
          <CastleProvider myCastleId={currentUser?.castles[0].id}>
            <Home />
          </CastleProvider>
        </SocketsContextProvider>
      </UnitTypesContextProvider>
    </TribeTypesContextProvider>
  )
}
