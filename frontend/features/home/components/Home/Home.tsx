import styles from './Home.module.scss'
import { Map } from '../../../map';
import {
  CastlesProvider,
  MyCastleProvider,
  useMyCastleContext,
  CastleDetailsProvider,
  CastleInfo
} from '../../../castle';
import { SelectedMapPointContextProvider, MapCenterContextProvider, MapSizeProvider } from '../../../map';
import { UnitTypesContextProvider } from '../../../unit';
import { TribeTypesContextProvider } from '../../../tribe';
import { CreateAttack, WarStatus } from '../../../attack';

function Home() {
  const { isMyCastleFetched } = useMyCastleContext()

  if (!isMyCastleFetched) {
    return null
  }

  return (
    <SelectedMapPointContextProvider>
      <MapCenterContextProvider>
        <MapSizeProvider>
          <CastlesProvider>
            <TribeTypesContextProvider>
              <UnitTypesContextProvider>
                <CastleDetailsProvider>
                  <div className={styles.container}>
                    <Map />
                    <div>
                      <CastleInfo className={styles.warSituation} />
                      <WarStatus className={styles.warSituation} />
                      <CreateAttack />
                    </div>
                  </div>
                </CastleDetailsProvider>
              </UnitTypesContextProvider>
            </TribeTypesContextProvider>
          </CastlesProvider>
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
