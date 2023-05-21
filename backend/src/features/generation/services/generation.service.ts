import {
  TribeType, MapSettlement, UnitType, UserRole
} from '@prisma/client'
import { generateSectors, sectorsGenerateMap, sidesList } from './sectors.service'
import { prisma } from '../../../config/prisma'
import { findTribeTypes } from '../../tribe/tribe.service'
import { findCastlesByCoordsRanges } from '../../castle/castle.service'
import { USERS_IN_SECTOR_LIMIT } from '../config'
import { Sector, Side } from '../types'
import { encryptPassword, findBotsAmount } from '../../user/user.service'
import { randomArrayItem, randomIntFromInterval } from '../../../utils/random'
import { findUnitTypes, getUnitTypesByTribeType } from '../../unitType/unitType.service'
import { callFormattedConsoleLog } from '../../../utils/console'

type SidesAngleIndexesMap = { [key in Side]: number }

type Point = { x: number, y: number }

type GenerateUserConfig = {
  nameFactory: (index: number) => string
  emailFactory: (index: number) => string
  passwordFactory: (index: number) => string
  isBot: boolean
  role: UserRole
  limit: number
  withTroops: boolean
}

function getSidesAngleIndexes(
  mapSettlement: MapSettlement[]
): SidesAngleIndexesMap {
  return {
    leftBottom: mapSettlement.find(({ direction }) => direction === <Side>'leftBottom').settleAngleIndex,
    leftTop: mapSettlement.find(({ direction }) => direction === <Side>'leftTop').settleAngleIndex,
    rightBottom: mapSettlement.find(({ direction }) => direction === <Side>'rightBottom').settleAngleIndex,
    rightTop: mapSettlement.find(({ direction }) => direction === <Side>'rightTop').settleAngleIndex
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

function getRandomGoldAmount() {
  return randomIntFromInterval(100, 3000)
}

function getUserOperation(
  point: Point,
  tribeType: TribeType,
  {
    nameFactory, isBot, withTroops, emailFactory, passwordFactory
  }: GenerateUserConfig,
  index: number,
  unitTypes: UnitType[]
) {
  const availableUnitTypes = getUnitTypesByTribeType(unitTypes, tribeType)

  return prisma.user.create({
    include: {
      castles: true
    },
    data: {
      tribeTypeId: tribeType.id,
      isBot,
      role: 'ADMIN',
      name: nameFactory(index),
      email: emailFactory(index),
      password: passwordFactory(index),
      castles: {
        create: {
          x: point.x,
          y: point.y,
          castleResources: {
            create: {
              gold: getRandomGoldAmount(),
              goldLastUpdate: new Date()
            }
          },
          unitGroups: {
            createMany: {
              data: withTroops
                ? availableUnitTypes.map(({ id }) => ({
                  unitTypeId: id,
                  amount: getRandomUnitsAmount(),
                  ownerAttackId: null
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
  return randomArrayItem<TribeType>(tribeTypes)
}

async function sectorUsersGenerate(
  sector: Sector,
  pointsToCreateLimit: number,
  existingPoints: Point[],
  tribeTypes: TribeType[],
  config: GenerateUserConfig,
  alreadyGeneratedUsersLength: number,
  unitTypes: UnitType[]
) {
  const models: { point : Point, tribeType: TribeType }[] = []

  let flag = true
  let count = 0

  while (flag) {
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
      count += 1
    }

    if (count >= pointsToCreateLimit) {
      flag = false
    }
  }

  return prisma.$transaction(
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

async function updateAngleIndex(angleIndex: number, side: Side, mapSettlements: MapSettlement[]) {
  return prisma.mapSettlement.update({
    where: {
      id: mapSettlements.find(({ direction }) => direction === side).id
    },
    data: {
      settleAngleIndex: angleIndex
    }
  })
}

function getSortedSidesList(initialSidesAngleIndexes: SidesAngleIndexesMap) {
  return [...sidesList].sort((one, two) => {
    if (initialSidesAngleIndexes[one] < initialSidesAngleIndexes[two]) {
      return -1
    }
    if (initialSidesAngleIndexes[one] > initialSidesAngleIndexes[two]) {
      return 1
    }
    return 0
  })
}

async function getSectorCapacityInfo({
  startX, startY, endY, endX
}: Sector) {
  const castles = await findCastlesByCoordsRanges(
    Math.min(startX, endX),
    Math.min(startY, endY),
    Math.max(startX, endX),
    Math.max(startY, endY)
  )

  return {
    existingPoints: castles.map(({ x, y }) => ({ x, y })),
    freeSpace: Math.max(USERS_IN_SECTOR_LIMIT - castles.length, 0)
  }
}

async function generateUsers(config: GenerateUserConfig) {
  const tribeTypes = await findTribeTypes()
  const unitTypes = await findUnitTypes()

  let flag = true
  const stopProcess = () => { flag = false }

  const mapSettlements = await prisma.mapSettlement.findMany()
  const initialSidesAngleIndexes = getSidesAngleIndexes(mapSettlements)
  let currentSide = getSortedSidesList(initialSidesAngleIndexes)[0]
  const currentSidesAngleIndexes = getSidesAngleIndexes(mapSettlements)

  const incrementCurrentSideAngle = (angleIndex: number) => {
    const value = angleIndex + 1
    currentSidesAngleIndexes[currentSide] = value
    return value
  }

  let generatedUsers = []
  const onNextSector = async (sector: Sector, angleIndex: number, isLastSectorInAngle: boolean) => {
    const restUsersToGenerate = config.limit - generatedUsers.length

    if (restUsersToGenerate <= 0) {
      stopProcess()
      return
    }

    const isNeedToGenerateFullSector = restUsersToGenerate >= USERS_IN_SECTOR_LIMIT
    const usersNumberLeftToCreateInSector = isNeedToGenerateFullSector
      ? USERS_IN_SECTOR_LIMIT
      : restUsersToGenerate

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
      await updateAngleIndex(newAngleIndex, currentSide, mapSettlements)
    }
  }

  const setNextSide = () => {
    const foundSideIndex = getSortedSidesList(initialSidesAngleIndexes)
      .findIndex((value) => value === currentSide)
    currentSide = getSortedSidesList(initialSidesAngleIndexes)[foundSideIndex + 1]
      || getSortedSidesList(initialSidesAngleIndexes)[0]
  }

  while (flag) {
    const currentSectorsGenerationModel = sectorsGenerateMap[currentSide]

    const currentSidesAngleIndex = currentSidesAngleIndexes[currentSide]

    await generateSectors(
      currentSectorsGenerationModel,
      onNextSector,
      (angleIndex) => angleIndex >= currentSidesAngleIndex + 1,
      currentSidesAngleIndex
    )

    setNextSide()
  }

  return generatedUsers
}

export async function generateBots(limit: number) {
  const botsAmount = await findBotsAmount()

  const withTroops = true

  callFormattedConsoleLog('Bots generation', 'info', { limit, withTroops })
  const encryptedPassword = await encryptPassword('password')

  await generateUsers({
    limit,
    isBot: true,
    role: UserRole.USER,
    nameFactory: (index) => `Bot user ${botsAmount + index}`,
    withTroops,
    emailFactory: (index) => `botUser${botsAmount + index}@example.com`,
    passwordFactory: () => encryptedPassword
  })

  // eslint-disable-next-line no-console
  console.log('[BOTS GENERATION END]')
}

export async function generateUser(name: string, email: string, password: string, role: UserRole) {
  const encryptedPassword = await encryptPassword(password)

  const [user] = await generateUsers({
    limit: 1,
    role,
    isBot: false,
    nameFactory: () => name,
    withTroops: true,
    passwordFactory: () => encryptedPassword,
    emailFactory: () => email
  })
  return user
}
