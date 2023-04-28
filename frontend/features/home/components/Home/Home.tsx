import {
  AppBar, Paper, Toolbar, Typography
} from '@mui/material'
import styles from './Home.module.scss'
import {
  Map, SelectedMapPointContextProvider, MapCenterContextProvider, MapSizeProvider
} from '../../../map'
import {
  CastlesRangeProvider,
  MyCastleProvider,
  useMyCastleContext,
  SelectedCastleDetailsProvider,
  CastleInfo
} from '../../../castle'
import { UnitTypesContextProvider } from '../../../unit'
import { TribeTypesContextProvider } from '../../../tribe'
import { CastleResourcesProvider } from '../../../resources'
import { useAuthContext } from '../../../auth'
import { AttackContextProvider } from '../../../attacksStatus/contexts/attackContext'

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
              <CastleInfo />
            </CastleResourcesProvider>
          </Paper>
        </div>
      </div>
    </div>
  )
}

export default () => (
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
