import styles from './Home.module.scss'
import { Map } from '../../../map';
import {
  CastlesRangeProvider,
  MyCastleProvider,
  useMyCastleContext,
  SelectedCastleDetailsProvider,
  CastleInfo
} from '../../../castle';
import { SelectedMapPointContextProvider, MapCenterContextProvider, MapSizeProvider } from '../../../map';
import { UnitTypesContextProvider } from '../../../unit';
import { TribeTypesContextProvider } from '../../../tribe';
import { useAuthContext } from '../../../auth';

function Home() {
  const { currentUserQuery: { data: currentUser } } = useAuthContext()
  const { myCastleDetailsQuery: { data: myCastleDetails } } = useMyCastleContext()

  if (!myCastleDetails || !currentUser) {
    return null
  }

  return (
    <SelectedMapPointContextProvider>
      <MapCenterContextProvider>
        <MapSizeProvider>
          <CastlesRangeProvider>
            <TribeTypesContextProvider>
              <UnitTypesContextProvider>
                <SelectedCastleDetailsProvider>
                  <div className={styles.container}>
                    <Map />
                    <CastleInfo className={styles.info} />
                  </div>
                </SelectedCastleDetailsProvider>
              </UnitTypesContextProvider>
            </TribeTypesContextProvider>
          </CastlesRangeProvider>
        </MapSizeProvider>
      </MapCenterContextProvider>
    </SelectedMapPointContextProvider>
  )
}

export default () => (
  <MyCastleProvider>
    <Home />
  </MyCastleProvider>
)
