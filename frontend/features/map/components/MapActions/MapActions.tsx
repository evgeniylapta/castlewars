import { FC, useMemo } from 'react'
import { ButtonGroup, Button } from '@mui/material'
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import HomeIcon from '@mui/icons-material/Home'
import HighlightAltIcon from '@mui/icons-material/HighlightAlt'
import styles from './MapActions.module.scss'
import { isPointsEqual } from '../../utils/mapUtils'
import { useMapCenterContext } from '../../contexts/mapCenterContext'
import { useSelectedMapPointContext } from '../../contexts/selectedMapPointContext'
import { useMyCastleContext } from '../../../castle'
import { useMapSizeContext } from '../../contexts/mapSizeContext'

const MapActions: FC = () => {
  const { isExpandedMap, expandMap, collapseMap } = useMapSizeContext()

  const { selectedPoint } = useSelectedMapPointContext()
  const { goToSelectedCastle, goToMyCastlePoint, currentCenterPoint } = useMapCenterContext()
  const { myCastlePoint } = useMyCastleContext()

  const showGoToMyCastleButton = useMemo(
    () => !isPointsEqual(myCastlePoint, currentCenterPoint),
    [myCastlePoint, currentCenterPoint]
  )

  const showGoToSelectedCastleButton = useMemo(
    () => !isPointsEqual(selectedPoint, myCastlePoint)
      && !isPointsEqual(selectedPoint, currentCenterPoint),
    [selectedPoint, currentCenterPoint, myCastlePoint]
  )

  return (
    <div className={styles.wrap}>
      <ButtonGroup variant="outlined" size="small">
        <Button
          startIcon={isExpandedMap ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
          onClick={isExpandedMap ? collapseMap : expandMap}
        >
          {isExpandedMap ? 'Collapse' : 'Expand'}
        </Button>
        {showGoToMyCastleButton && (
          <Button startIcon={<HomeIcon />} onClick={goToMyCastlePoint}>
            Go to my castle
          </Button>
        )}
        {showGoToSelectedCastleButton && (
          <Button startIcon={<HighlightAltIcon />} onClick={goToSelectedCastle}>
            Go to selected castle
          </Button>
        )}
      </ButtonGroup>
    </div>
  )
}

export default MapActions
