import { FC } from 'react'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import { IconButton } from '@mui/material'
import { useMapCenterContext } from '../../contexts/mapCenterContext'

const Controls: FC = () => {
  const {
    goBottom, goLeft, goRight, goTop
  } = useMapCenterContext()

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
