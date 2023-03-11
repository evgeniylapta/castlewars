import { FC, useMemo } from 'react'
import styles from './Map.module.scss'
import Cell from '../Cell/Cell'
import Controls from '../Controls/Controls'
import { useMapPointsContext, MapPointsProvider } from '../../contexts/mapPointsContext'
import Numbers from '../Numbers/Numbers'
import MapActions from '../MapActions/MapActions'
import { isPointsEqual } from '../../utils/mapUtils'
import { useCastlesRangeContext, useMyCastleContext } from '../../../castle'
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

const Map: FC = () => {
  const { mapSize } = useMapSizeContext()

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
          {/* {showSpinner && ( */}
          {/*   <div className={styles.spinnerOverlay}> */}
          {/* <Spinner  /> */}
          {/* </div> */}
          {/* )} */}

          {models.map(({
            key, isCastle, isOwnCastle, point
          }) => (
            <Cell point={point} key={key} isCastle={isCastle} isOwnCastle={isOwnCastle} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default () => (
  <MapPointsProvider>
    <Map />
  </MapPointsProvider>
)
