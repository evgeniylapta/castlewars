import { FC, useMemo } from 'react';
import { useMapContext } from '../../contexts/mapContext';
import styles from './MapActions.module.scss';
import { isPointsEqual } from '../../utils/mapUtils';

const MapActions: FC = () => {
  const {
    expandingHandle: { isExpandedMap, expandMap, collapseMap },
    selection: { selectedPoint },
    myCastlePoint,
    centerPointHandle: { goToMyCastlePoint, goToSelectedCastle, currentCenterPoint }
  } = useMapContext()

  const showGoToMyCastleButton = useMemo(
    () => !isPointsEqual(myCastlePoint, currentCenterPoint),
    [myCastlePoint, currentCenterPoint]
  );

  const showGoToSelectedCastleButton = useMemo(
    () => !isPointsEqual(selectedPoint, myCastlePoint) && !isPointsEqual(selectedPoint, currentCenterPoint),
    [selectedPoint, currentCenterPoint, myCastlePoint]
  );

  return (
    <div className={styles.wrap}>
      <button onClick={isExpandedMap ? collapseMap : expandMap}>
        {isExpandedMap ? 'Collapse' : 'Expand'}
      </button>
      {showGoToMyCastleButton && (
        <button onClick={goToMyCastlePoint}>
          Go to my castle
        </button>
      )}
      {showGoToSelectedCastleButton && (
        <button onClick={goToSelectedCastle}>
          Go to selected castle
        </button>
      )}
    </div>
  )
}

export default MapActions
