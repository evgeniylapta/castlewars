const SECTOR_STEP = 5;

export type Sector = { startX: number, startY: number, endX: number, endY: number }

export type TSide = 'leftTop' | 'rightTop' | 'leftBottom'  | 'rightBottom'


function generateSectorKey(sector: Sector) {
  return `${sector.startX}_${sector.startY}_${sector.endX}_${sector.endY}`
}

type MoveCommand = 'straight' | 'side'

type TSectorsGenerationModel = {
  initialSectorByAngleModifier: (angleIndex: number) => Sector
  straightSectorModifier: (currentSector: Sector) => Sector
  sideSectorModifier: (currentSector: Sector) => Sector
  sideSectorResetCondition: (sector: Sector) => boolean
  checkIsSectorInIgnoredArea: (initialAngleIndex: number, sector: Sector) => boolean
}

const bottomRightModel: TSectorsGenerationModel = {
  initialSectorByAngleModifier: (angleIndex: number): Sector => {
    const offset = angleIndex * SECTOR_STEP

    return {
      startX: offset,
      startY: 0,
      endX: offset + SECTOR_STEP,
      endY: -SECTOR_STEP
    }
  },
  straightSectorModifier: (currentSector: Sector): Sector => {
    return {
      ...currentSector,
      startY: currentSector.startY - SECTOR_STEP,
      endY: currentSector.endY - SECTOR_STEP
    }
  },
  sideSectorModifier: (currentSector: Sector): Sector => {
    return {
      ...currentSector,
      startX: currentSector.startX - SECTOR_STEP,
      endX: currentSector.endX - SECTOR_STEP
    }
  },
  sideSectorResetCondition: (sector: Sector): boolean => {
    return sector.startX <= 0
  },
  checkIsSectorInIgnoredArea: (initialAngleIndex, sector) => {
    return sector.endX <= (initialAngleIndex) * SECTOR_STEP
      && sector.endY >= -(initialAngleIndex) * SECTOR_STEP
  }
}

const topRightModel: TSectorsGenerationModel = {
  initialSectorByAngleModifier: (angleIndex: number): Sector => {
    const offset = angleIndex * SECTOR_STEP

    return {
      startX: offset,
      startY: 0,
      endX: offset + SECTOR_STEP,
      endY: SECTOR_STEP
    }
  },
  straightSectorModifier: (currentSector: Sector): Sector => {
    return {
      ...currentSector,
      startY: currentSector.startY + SECTOR_STEP,
      endY: currentSector.endY + SECTOR_STEP
    }
  },
  sideSectorModifier: (currentSector: Sector): Sector => {
    return {
      ...currentSector,
      startX: currentSector.startX - SECTOR_STEP,
      endX: currentSector.endX - SECTOR_STEP
    }
  },
  sideSectorResetCondition: (sector: Sector): boolean => {
    return sector.startX <= 0
  },
  checkIsSectorInIgnoredArea: (initialAngleIndex, sector) => {
    return sector.endX <= (initialAngleIndex) * SECTOR_STEP
      && sector.endY <= (initialAngleIndex) * SECTOR_STEP
  }
}

const topLeftModel: TSectorsGenerationModel = {
  initialSectorByAngleModifier: (angleIndex: number): Sector =>{
    const offset = angleIndex * SECTOR_STEP

    return {
      startX: -offset - SECTOR_STEP,
      startY: SECTOR_STEP,
      endX: -offset,
      endY: 0
    }
  },
  straightSectorModifier: (currentSector: Sector): Sector => {
    return {
      ...currentSector,
      startY: currentSector.startY + SECTOR_STEP,
      endY: currentSector.endY + SECTOR_STEP
    }
  },
  sideSectorModifier: (currentSector: Sector): Sector => {
    return {
      ...currentSector,
      startX: currentSector.startX + SECTOR_STEP,
      endX: currentSector.endX + SECTOR_STEP
    }
  },
  sideSectorResetCondition: (sector: Sector): boolean => {
    return sector.endX >= 0
  },
  checkIsSectorInIgnoredArea: (initialAngleIndex, sector) => {
    return sector.startX >= -(initialAngleIndex) * SECTOR_STEP
      && sector.startY <= (initialAngleIndex) * SECTOR_STEP
  }
}

const bottomLeftModel: TSectorsGenerationModel = {
  initialSectorByAngleModifier: (angleIndex: number): Sector => {
    const offset = angleIndex * SECTOR_STEP

    return {
      startX: -offset - SECTOR_STEP,
      startY: 0,
      endX: -offset,
      endY: -SECTOR_STEP
    }
  },
  straightSectorModifier: (currentSector: Sector): Sector => {
    return {
      ...currentSector,
      startY: currentSector.startY - SECTOR_STEP,
      endY: currentSector.endY - SECTOR_STEP
    }
  },
  sideSectorModifier: (currentSector: Sector): Sector => {
    return {
      ...currentSector,
      startX: currentSector.startX + SECTOR_STEP,
      endX: currentSector.endX + SECTOR_STEP
    }
  },
  sideSectorResetCondition: (sector: Sector): boolean => {
    return sector.endX >= 0
  },
  checkIsSectorInIgnoredArea: (initialAngleIndex, sector) => {
    return sector.endX >= -(initialAngleIndex) * SECTOR_STEP
      && sector.endY >= -(initialAngleIndex) * SECTOR_STEP
  }
}

export async function generateSectors(
  {
    initialSectorByAngleModifier,
    straightSectorModifier,
    sideSectorModifier,
    sideSectorResetCondition,
    checkIsSectorInIgnoredArea,
  }: TSectorsGenerationModel,
  onNextSector: (sector: Sector, angleIndex: number, isLastSectorInAngle: boolean) => Promise<void>,
  exitCondition: (angleIndex: number) => boolean,
  angleInitialIndex
) {
  const sectors: { [key: string]: Sector } = {}
  let angleIndex = angleInitialIndex

  const addSectorToList = async (sector: Sector, isLastSectorInAngle: boolean) => {
    sectors[generateSectorKey(sector)] = sector
    await onNextSector(sector, angleIndex, isLastSectorInAngle)
  }

  let currentSector: Sector = initialSectorByAngleModifier(angleIndex)
  let currentCommand: MoveCommand | undefined = undefined
  let flag = true;

  const incrementAngleIndex = () => {
    angleIndex++
    currentSector = initialSectorByAngleModifier(angleIndex)
    currentCommand = undefined
  }

  while(flag) {
    if(exitCondition(angleIndex)) {
      flag = false
      break
    }

    if(!currentCommand) {
      await addSectorToList(currentSector, !angleIndex)

      if (!angleIndex) {
        incrementAngleIndex()
        continue
      }

      currentCommand = 'straight'
      continue
    }

    if (currentCommand === 'straight') {
      const newSector = straightSectorModifier(currentSector)

      await addSectorToList(newSector, false)
      currentSector = newSector

      currentCommand = 'side'

      continue
    }

    if (currentCommand === 'side') {
      const newSector: Sector = sideSectorModifier(currentSector)
      const isSectorInIgnoredArea = checkIsSectorInIgnoredArea(angleInitialIndex, newSector)
      const isSectorPassed = sectors[generateSectorKey(newSector)]
      const isLastSectorInAngle = sideSectorResetCondition(newSector)

      if(!isSectorPassed && !isSectorInIgnoredArea) {
        await addSectorToList(newSector, isLastSectorInAngle)
        currentSector = newSector
        currentCommand = 'side'
      } else {
        currentCommand = 'straight'
      }

      if (isLastSectorInAngle) {
        incrementAngleIndex()
      }
    }
  }
}

export const sectorsGenerateMap: { [key in TSide]: TSectorsGenerationModel } = {
  rightTop: topRightModel,
  rightBottom: bottomRightModel,
  leftTop: topLeftModel,
  leftBottom: bottomLeftModel
}

export const sidesList: TSide[] = ['leftTop', 'rightTop', 'leftBottom', 'rightBottom']
