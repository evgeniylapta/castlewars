import { FC, useMemo } from 'react'
import styles from './Map.module.scss'
import Cell from '../Cell/Cell'
import Controls from '../Controls/Controls'
import { useMapPointsContext, MapPointsProvider } from '../../contexts/mapPointsContext'
import Numbers from '../Numbers/Numbers'
import MapActions from '../MapActions/MapActions'
import { isPointsEqual } from '../../utils/mapUtils'
import { useCastlesRangeContext, useMyCastleContext } from '../../../../entities/castle'
import { useMapSizeContext } from '../../contexts/mapSizeContext'

function useModels() {
  const { pointsList } = useMapPointsContext()
  const { castlesQuery: { data: castles } } = useCastlesRangeContext()
  const { myCastlePoint } = useMyCastleContext()

  return useMemo(() => pointsList.map((point) => {
    const foundCastle = castles?.find(({ x, y }) => point.x === x && y === point.y)

    return {
      key: `${point.x}_${point.y}`,
      isCastle: !!foundCastle,
      isOwnCastle: !!myCastlePoint && isPointsEqual(point, myCastlePoint),
      point
    }
  }), [pointsList, castles, myCastlePoint])
}

const Map: FC = () => (
  <div className={styles.mapContainer}>
    <div className={styles.mapWrap}>
      <div className={styles.actions}>
        <MapActions />
      </div>
      <Numbers />
      <div className={styles.controls}>
        <Controls />
      </div>
      <div
        className={styles.map}
        style={{ gridTemplateColumns: `repeat(${useMapSizeContext().mapSize}, 1fr)` }}
      >
        {useModels().map(({
          key, isCastle, isOwnCastle, point
        }) => (
          <Cell point={point} key={key} isCastle={isCastle} isOwnCastle={isOwnCastle} />
        ))}
      </div>
    </div>
  </div>
)

export default () => (
  <MapPointsProvider>
    <Map />
  </MapPointsProvider>
)
