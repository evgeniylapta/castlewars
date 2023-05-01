import { FC } from 'react'
import { ButtonGroup, Button } from '@mui/material'
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import HomeIcon from '@mui/icons-material/Home'
import HighlightAltIcon from '@mui/icons-material/HighlightAlt'
import styles from './MapActions.module.scss'
import { useMapContext } from '../../contexts/mapContext'
import { useCastleContext } from '../../../../entities/castle'
import { isPointsEqual } from '../../utils/isPointsEqual'
import { pointByCastle } from '../../utils/castle'

function useGoToSelectedCastle() {
  const {
    selectedCastleQuery: { data: selectedCastle },
    myCastleQuery: { data: myCastle }
  } = useCastleContext()
  const { centerPoint, setCenterPoint } = useMapContext()

  const selectedCastleEqualMyCastle = !!selectedCastle
    && !!myCastle
    && isPointsEqual(pointByCastle(selectedCastle), pointByCastle(myCastle))

  const selectedCastleEqualCurrentCenter = !!selectedCastle
    && isPointsEqual(pointByCastle(selectedCastle), centerPoint)

  return {
    showGoToSelectedCastleButton: !selectedCastleEqualMyCastle
      && !selectedCastleEqualCurrentCenter,
    goToSelectedCastle: () => {
      if (selectedCastle) {
        setCenterPoint(pointByCastle(selectedCastle))
      }
    }
  }
}

function useGoToMyCastlePoint() {
  const { myCastleQuery: { data: myCastle } } = useCastleContext()
  const { centerPoint, setCenterPoint } = useMapContext()
  const { setSelectedCastleId } = useCastleContext()

  return {
    showGoToMyCastleButton: !!myCastle && !isPointsEqual(pointByCastle(myCastle), centerPoint),
    goToMyCastlePoint: () => {
      if (myCastle) {
        setCenterPoint(pointByCastle(myCastle))
        setSelectedCastleId(undefined)
      }
    }
  }
}

const MapActions: FC = () => {
  const { isExpanded, expandMap, collapseMap } = useMapContext()
  const { showGoToMyCastleButton, goToMyCastlePoint } = useGoToMyCastlePoint()
  const { showGoToSelectedCastleButton, goToSelectedCastle } = useGoToSelectedCastle()

  return (
    <div className={styles.wrap}>
      <ButtonGroup variant="outlined" size="small">
        <Button
          startIcon={isExpanded ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
          onClick={isExpanded ? collapseMap : expandMap}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
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
