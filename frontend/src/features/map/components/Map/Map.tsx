import {
  ForwardedRef,
  forwardRef, ForwardRefRenderFunction, useImperativeHandle, useMemo
} from 'react'
import styles from './Map.module.scss'
import Cell from '../Cell/Cell'
import Controls from '../Controls/Controls'
import Numbers from '../Numbers/Numbers'
import MapActions from '../MapActions/MapActions'
import { MapContextProvider, useMapContext } from '../../contexts/mapContext'
import { cellsModels } from '../../utils/cells'
import { extremePoints } from '../../utils/extremePoints'
import { mapSize } from '../../utils/mapSize'
import { useCastleContext } from '../../../../entities/castle'

function useCells() {
  const {
    centerPoint,
    isExpanded,
    castlesQuery: { data: castles }
  } = useMapContext()

  const {
    myCastleQuery: { data: myCastle },
    selectedCastleQuery: { data: selectedCastle }
  } = useCastleContext()

  return useMemo(
    () => cellsModels(
      castles,
      extremePoints(centerPoint, mapSize(isExpanded)),
      myCastle?.id,
      selectedCastle?.id
    ),
    [castles, centerPoint, isExpanded, myCastle, selectedCastle]
  )
}

export type MapRefProps = {
  goToMyCastlePoint: () => void,
}

function useImperativeHandleInit(forwardedRef: ForwardedRef<MapRefProps>) {
  const { goToMyCastlePoint } = useMapContext()

  useImperativeHandle(forwardedRef, () => ({
    goToMyCastlePoint
  }))
}

const MapContent: ForwardRefRenderFunction<MapRefProps> = (_, forwardedRef) => {
  useImperativeHandleInit(forwardedRef)

  return (
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
          style={{
            gridTemplateColumns: `repeat(${mapSize(useMapContext().isExpanded)}, 1fr)`
          }}
        >
          {useCells()
            .map((model) => (
              <Cell cellModel={model} key={`${model.point.x}_${model.point.y}`} />
            ))}
        </div>
      </div>
    </div>
  )
}

const MapContentForwarded = forwardRef(MapContent)

const Map: ForwardRefRenderFunction<MapRefProps> = (_, forwardedRef) => (
  <MapContextProvider>
    <MapContentForwarded ref={forwardedRef} />
  </MapContextProvider>
)

export default forwardRef(Map)
