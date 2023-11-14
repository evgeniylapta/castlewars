import { FC } from 'react'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import { IconButton } from '@mui/material'
import { useMapContext } from '../../contexts/mapContext'

function useMapControlsHandle() {
  const { centerPoint, setCenterPoint } = useMapContext()

  return {
    goLeft: () => setCenterPoint({ ...centerPoint, x: centerPoint.x - 1 }),
    goRight: () => setCenterPoint({ ...centerPoint, x: centerPoint.x + 1 }),
    goTop: () => setCenterPoint({ ...centerPoint, y: centerPoint.y + 1 }),
    goBottom: () => setCenterPoint({ ...centerPoint, y: centerPoint.y - 1 })
  }
}

const Controls: FC = () => {
  const {
    goBottom, goLeft, goRight, goTop
  } = useMapControlsHandle()

  return (
    <>
      <IconButton onClick={goTop}><ArrowUpwardIcon /></IconButton>
      <IconButton onClick={goLeft}><ArrowBackIcon /></IconButton>
      <IconButton onClick={goRight}><ArrowForwardIcon /></IconButton>
      <IconButton onClick={goBottom}><ArrowDownwardIcon /></IconButton>
    </>
  )
}

export default Controls
