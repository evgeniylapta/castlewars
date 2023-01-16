import { FC, useMemo } from 'react';
import styles from './MapActions.module.scss';
import { isPointsEqual } from '../../utils/mapUtils';
import { useMapCenterContext } from '../../contexts/mapCenterContext';
import { useSelectedMapPointContext } from '../../contexts/selectedMapPointContext';
import { useMyCastleContext } from '../../../castle';
import { useMapSizeContext } from '../../contexts/mapSizeContext';

const MapActions: FC = () => {
  const { isExpandedMap, expandMap, collapseMap } = useMapSizeContext()

  const { selectedPoint } = useSelectedMapPointContext()
  const { goToSelectedCastle, goToMyCastlePoint, currentCenterPoint } = useMapCenterContext()
  const { myCastlePoint } = useMyCastleContext()

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
          Navigate to my castle
        </button>
      )}
      {showGoToSelectedCastleButton && (
        <button onClick={goToSelectedCastle}>
          Navigate to selected castle
        </button>
      )}
    </div>
  )
}

export default MapActions
