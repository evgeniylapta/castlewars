import styles from './Home.module.scss'
import { Map } from '../../../map';
import { CastlesProvider } from '../../../castles';
import { AuthProvider } from '../../../auth';
import { WarStatus } from '../../../warStatus';
import { CastleInfo } from '../../../castleInfo';

export default function Home() {
  return (
    <AuthProvider>
      <CastlesProvider>
        <div className={styles.container}>
          <Map />

          <CastleInfo className={styles.warSituation} />

          <WarStatus className={styles.warSituation} />
        </div>
      </CastlesProvider>
    </AuthProvider>
  )
}
