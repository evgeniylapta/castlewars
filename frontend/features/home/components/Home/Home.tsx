import styles from './Home.module.scss'
import legionnaire from '../../../map/assets/legionnaire.png'
import { Map } from '../../../map';
import { CastlesProvider } from '../../../castles';
import { AuthProvider } from '../../../auth';

export default function Home() {
  return (
    <AuthProvider>
      <CastlesProvider>
        <div className={styles.container}>
          <Map />

          <div className={styles.warriors} id="warriors">
            <div className={styles.img} id="img">
              <img src={legionnaire.src} />
              <div className={styles.number} id="number" />
            </div>

            <div className={styles.war_situation} id="war_situation">
            </div>
          </div>
        </div>
      </CastlesProvider>
    </AuthProvider>
  )
}
