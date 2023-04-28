import {
  AppBar, Paper, Toolbar, Typography
} from '@mui/material'
import styles from './Index.module.scss'
import { useAuthContext } from '../src/entities/auth'
import {
  CastlesRangeProvider,
  MyCastleProvider,
  SelectedCastleDetailsProvider,
  useMyCastleContext
} from '../src/entities/castle'
import { CastleResourcesProvider } from '../src/entities/resources'
import {
  MapCenterContextProvider,
  MapSizeProvider,
  SelectedMapPointContextProvider,
  Map
} from '../src/features/map'
import { TribeTypesContextProvider } from '../src/entities/tribe'
import { UnitTypesContextProvider } from '../src/entities/unit'
import { AttackContextProvider } from '../src/features/attacksStatus/contexts/attackContext'
import { CastleInfoList } from '../src/widgets/castleInfoList'

function Home() {
  const { currentUserQuery: { data: currentUser } } = useAuthContext()
  const { myCastleDetailsQuery: { data: myCastleDetails } } = useMyCastleContext()

  if (!myCastleDetails || !currentUser) {
    return null
  }

  return (
    <div>
      <AppBar position="sticky" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Castlewars
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={styles.container}>
        <div className={styles.mapWrap}>
          <Paper elevation={3}>
            <Map />
          </Paper>
        </div>
        <div className={styles.infoWrap}>
          <Paper elevation={3}>
            <CastleResourcesProvider>
              <CastleInfoList />
            </CastleResourcesProvider>
          </Paper>
        </div>
      </div>
    </div>
  )
}

export default function () {
  return (
    <MyCastleProvider>
      <SelectedMapPointContextProvider>
        <MapCenterContextProvider>
          <MapSizeProvider>
            <CastlesRangeProvider>
              <TribeTypesContextProvider>
                <UnitTypesContextProvider>
                  <SelectedCastleDetailsProvider>
                    <AttackContextProvider>
                      <Home />
                    </AttackContextProvider>
                  </SelectedCastleDetailsProvider>
                </UnitTypesContextProvider>
              </TribeTypesContextProvider>
            </CastlesRangeProvider>
          </MapSizeProvider>
        </MapCenterContextProvider>
      </SelectedMapPointContextProvider>
    </MyCastleProvider>
  )
}
