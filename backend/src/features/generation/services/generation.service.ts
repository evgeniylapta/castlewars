import { generateSectors, sectorsGenerateMap, sidesList } from './sectors.service';
import { prisma } from '../../../config/prisma';
import { findTribeTypes } from '../../tribe/tribe.service';
import { TribeType, MapSettlement, UnitType } from '@prisma/client';
import { findCastlesByCoordsRanges } from '../../castle/castle.service';
import { USERS_IN_SECTOR_LIMIT } from '../config';
import { Sector, TSide } from '../types';
import { selectBotsAmount } from '../../user/user.service';
import { getRandomArrayItem, randomIntFromInterval } from '../../../utils/random';
import { findUnitTypes, getUnitTypesByTribeType } from '../../unit/services/unitType.service';

type TSidesAngleIndexesMap = { [key in TSide]: number }

type TPoint = { x: number, y: number }

type TGenerateUserConfig = {
  nameFactory: (index: number) => string
  isBot: boolean
  limit: number
  withTroops: boolean
}

async function getSidesAngleIndexes(mapSettlement: MapSettlement[]): Promise<TSidesAngleIndexesMap> {
  return {
    leftBottom: mapSettlement.find(({ direction }) => direction === <TSide>'leftBottom').settleAngleIndex,
    leftTop: mapSettlement.find(({ direction }) => direction === <TSide>'leftTop').settleAngleIndex,
    rightBottom: mapSettlement.find(({ direction }) => direction === <TSide>'rightBottom').settleAngleIndex,
    rightTop: mapSettlement.find(({ direction }) => direction === <TSide>'rightTop').settleAngleIndex
  }
}

function getSectorRandomPoint(sector: Sector) {
  return {
    x: randomIntFromInterval(sector.startX, sector.endX),
    y: randomIntFromInterval(sector.startY, sector.endY)
  }
}

function getRandomUnitsAmount() {
  return randomIntFromInterval(10, 100)
}

function getUserOperation(
  point: TPoint,
  tribeType: TribeType,
  { nameFactory, isBot, withTroops }: TGenerateUserConfig,
  index: number,
  unitTypes: UnitType[]
) {
  const availableUnitTypes = getUnitTypesByTribeType(unitTypes, tribeType)

  return prisma.user.create({
    include: {
      castles: true
    },
    data: {
      tribeId: tribeType.id,
      isBot,
      name: nameFactory(index),
      castles: {
        create: {
          x: point.x,
          y: point.y,
          castleResources: {
            create: {
              gold: 0
            }
          },
          unitGroups: {
            createMany: {
              data: withTroops
                ? availableUnitTypes.map(({ id }) => ({
                  unitTypeId: id,
                  amount: getRandomUnitsAmount(),
                  ownerAttackId: null,
                }))
                : []
            }
          }
        }
      }
    }
  })
}

function getRandomTribeType(tribeTypes: TribeType[]) {
  return getRandomArrayItem<TribeType>(tribeTypes)
}

async function sectorUsersGenerate(
  sector: Sector,
  pointsToCreateLimit: number,
  existingPoints: TPoint[],
  tribeTypes: TribeType[],
  config: TGenerateUserConfig,
  alreadyGeneratedUsersLength: number,
  unitTypes: UnitType[]
) {
  const models: { point : TPoint, tribeType: TribeType }[] = []

  let flag = true
  let count = 0

  while(flag) {
    const newPoint = getSectorRandomPoint(sector)
    const isZeroPoint = newPoint.x === 0 && newPoint.y === 0
    const isPointAlreadyInModelsList = models.some(
      ({ point: { y, x } }) => y === newPoint.y && x === newPoint.x
    )
    const isPointAlreadyExists = existingPoints.some(
      ({ y, x }) => y === newPoint.y && x === newPoint.x
    )

    if (!isPointAlreadyInModelsList && !isZeroPoint && !isPointAlreadyExists) {
      models.push({ point: newPoint, tribeType: getRandomTribeType(tribeTypes) })
      count++
    }

    if (count >= pointsToCreateLimit) {
      flag = false
    }
  }

  return await prisma.$transaction(
    models.map(({ point, tribeType }, index) => (
      getUserOperation(
        point,
        tribeType,
        config,
        (alreadyGeneratedUsersLength + index + 1),
        unitTypes
      )
    ))
  )
}

async function angleIndexUpdate(angleIndex: number, side: TSide, mapSettlements: MapSettlement[]) {
  return prisma.mapSettlement.update({
    where: {
      id: mapSettlements.find(({ direction }) => direction === side).id
    },
    data: {
      settleAngleIndex: angleIndex
    }
  })
}

function getSortedSidesList(initialSidesAngleIndexes: TSidesAngleIndexesMap) {
  return [...sidesList].sort((one, two) => {
    if (initialSidesAngleIndexes[one] < initialSidesAngleIndexes[two]) {
      return -1;
    }
    if (initialSidesAngleIndexes[one] > initialSidesAngleIndexes[two]) {
      return 1;
    }
    return 0;
  })
}

async function getSectorCapacityInfo({ startX, startY, endY, endX }: Sector) {
  const castles = await findCastlesByCoordsRanges(
    Math.min(startX, endX),
    Math.min(startY, endY),
    Math.max(startX, endX),
    Math.max(startY, endY)
  )

  return {
    existingPoints: castles.map(({ x, y }) => ({ x, y })),
    freeSpace: Math.max(USERS_IN_SECTOR_LIMIT - castles.length, 0),
  }
}

async function generateUsers(config: TGenerateUserConfig) {
  const { limit } = config
  const mapSettlements = await prisma.mapSettlement.findMany();
  const initialSidesAngleIndexes = await getSidesAngleIndexes(mapSettlements)

  const sortedSidesList = getSortedSidesList(initialSidesAngleIndexes)
  let currentSide = sortedSidesList[0]

  const sidesAngleIndexes = initialSidesAngleIndexes

  const tribeTypes = await findTribeTypes()
  const unitTypes = await findUnitTypes()

  let generatedUsers = []

  let flag = true
  const stopProcess = () => flag = false

  const incrementCurrentSideAngle = (angleIndex: number) => {
    const value = angleIndex + 1
    sidesAngleIndexes[currentSide] = value
    return value
  }

  const onNextSector = async (sector: Sector, angleIndex: number, isLastSectorInAngle: boolean) => {
    const restUsersToGenerate = limit - generatedUsers.length

    if (restUsersToGenerate <= 0) {
      stopProcess()
      return
    }

    const isNeedToGenerateFullSector = restUsersToGenerate >= USERS_IN_SECTOR_LIMIT
    const usersNumberLeftToCreateInSector = isNeedToGenerateFullSector ? USERS_IN_SECTOR_LIMIT : restUsersToGenerate

    const { freeSpace: sectionFreeSpace, existingPoints } = await getSectorCapacityInfo(sector)

    const actualUsersNumberToCreate = Math.min(sectionFreeSpace, usersNumberLeftToCreateInSector)

    if (actualUsersNumberToCreate) {
      generatedUsers = [
        ...generatedUsers,
        ...await sectorUsersGenerate(
          sector,
          actualUsersNumberToCreate,
          existingPoints,
          tribeTypes,
          config,
          generatedUsers.length,
          unitTypes
        )
      ]
    }

    if (isLastSectorInAngle && actualUsersNumberToCreate >= sectionFreeSpace) {
      const newAngleIndex = incrementCurrentSideAngle(angleIndex)
      await angleIndexUpdate(newAngleIndex, currentSide, mapSettlements)
    }
  }

  const setNextSide = () => {
    const foundSideIndex = sortedSidesList.findIndex((value) => value === currentSide)
    currentSide = sortedSidesList[foundSideIndex + 1] || sortedSidesList[0]
  }

  while(flag) {
    const currentSectorsGenerationModel = sectorsGenerateMap[currentSide]

    const currentSidesAngleIndex = sidesAngleIndexes[currentSide]

    await generateSectors(
      currentSectorsGenerationModel,
      onNextSector,
      angleIndex => angleIndex >= currentSidesAngleIndex + 1,
      currentSidesAngleIndex
    )

    setNextSide()
  }

  return generatedUsers
}

export async function generateBots(limit: number) {
  const botsAmount = await selectBotsAmount()

  const withTroops = true

  console.log('[Bots generation]', { limit, withTroops });

  await generateUsers({
    limit,
    isBot: true,
    nameFactory: (index) => `Bot user ${botsAmount + index}`,
    withTroops
  })

  console.log('[Bots generation end]');
}

export async function generateUser(name: string) {
  const [user] = await generateUsers({
    limit: 1,
    isBot: false,
    nameFactory: () => name,
    withTroops: true
  })
  return user
}
