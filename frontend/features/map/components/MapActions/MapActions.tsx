import { FC } from 'react';
import { useMapContext } from '../../contexts/mapContext';
import styles from './MapActions.module.scss';

const MapActions: FC = () => {
  const { expanding: { isExtendedMap, expandMap, collapseMap }, goToMyCastlePoint } = useMapContext()

  return (
    <div className={styles.wrap}>
      <button onClick={isExtendedMap ? collapseMap : expandMap}>
        {isExtendedMap ? 'Collapse' : 'Expand'}
      </button>
      <button onClick={goToMyCastlePoint}>
        Go to my castle
      </button>
    </div>
  )
}

export default MapActions
