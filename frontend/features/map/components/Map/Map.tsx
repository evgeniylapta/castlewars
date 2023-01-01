import styles from './Map.module.scss'
import { FC, useMemo } from 'react';
import classNames from 'classnames';
import Cell from '../Cell/Cell';
import Controls from '../Controls/Controls';
import { MapProvider, useMapContext } from '../../contexts/mapContext';
import { useCastlesContext } from '../../../castles';
import { useAuthContext } from '../../../auth';
import Numbers from '../Numbers/Numbers';
import MapActions from '../MapActions/MapActions';

function useModels() {
  const { pointsList } = useMapContext()
  const { castles } = useCastlesContext()
  const { userData: { userId } } = useAuthContext()

  return useMemo(() => {
    return pointsList.map((point) => {
      const foundCastle =  castles.find(({ x, y }) => point.x === x && y === point.y)

      return {
        key: `${point.x}_${point.y}`,
        isCastle: !!foundCastle,
        isOwnCastle: foundCastle?.userId === userId,
        point
      }
    })
  }, [pointsList, castles, userId])
}

const Map: FC = () => {
  const { mapSize } = useMapContext()

  const models = useModels()

  return (
    <div className={styles.mapContainer}>
      <Controls />

      <div className={styles.mapWrap}>
        <div className={styles.mapControlsWrap}>
          <MapActions />
        </div>
        <Numbers />
        <div className={styles.map} style={{ gridTemplateColumns: `repeat(${mapSize}, 1fr)` }}>
          {models.map(({ key, isCastle, isOwnCastle, point }) => (
            <Cell point={point} key={key} isCastle={isCastle} isOwnCastle={isOwnCastle} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default () => (
  <MapProvider>
    <Map />
  </MapProvider>
)
