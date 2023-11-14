import {
  UnitGroup, UnitType, Attack, Castle
} from '@prisma/client'
import { add } from 'date-fns'
import { calculateDistanceBetweenPoints, SocketAction, unitTypesMovingSeconds } from '@castlewars/shared-utils'
import { prisma } from '../../../config/prisma'
import {
  getUnitGroupByUnitType,
  getUnitGroupUpdateAmountOperation,
  getUnitGroupCreateOperation
} from '../../unitGroup/unitGroup.service'
import { findUnitTypes, getUnitTypeById } from '../../unitType/unitType.service'
import { callFormattedConsoleLog } from '../../../utils/console'
import { broadcastSocketsEvent } from '../../sockets/socketsInitService'
import { getAttackUpdateModels } from './attackCalculation.service'
import { prepareCreateAttacksHistoryOperation } from './attackHistory.service'
import { UnitGroupCreateModel, UnitGroupUpdateAmountModel } from '../../unitGroup/types'

function attackDeleteOperation(attackId: Attack['id']) {
  return prisma.attack.delete({
    where: {
      id: attackId
    },
    include: {
      unitGroups: true
    }
  })
}

function getAttackUpdateReturningDateOperation(
  attackId: Attack['id'],
  attackDate: Date,
  attackUnitTypesLeft: UnitType[],
  distance: number
) {
  const newDate = add(
    attackDate,
    {
      seconds: unitTypesMovingSeconds(attackUnitTypesLeft, distance)
    }
  )

  return prisma.attack.update({
    where: {
      id: attackId
    },
    data: {
      isReturning: true,
      dateTime: newDate
    }
  })
}

function getLeftAttackUpdateUnitTypes(
  attackUpdateModels: UnitGroupUpdateAmountModel[],
  attackUnitGroups: UnitGroup[],
  unitTypes: UnitType[]
) {
  return attackUnitGroups
    .filter(({ id }) => attackUpdateModels.some(({ unitGroupId }) => unitGroupId === id))
    .map(({ unitTypeId }) => getUnitTypeById(unitTypes, unitTypeId))
}

async function findAttacks() {
  return prisma.attack.findMany({
    where: {
      dateTime: {
        lte: new Date()
      }
    },
    include: {
      unitGroups: true,
      castleFrom: {
        include: {
          unitGroups: true
        }
      },
      castleTo: {
        include: {
          unitGroups: true
        }
      }
    }
  })
}

function getAttackOperations(
  castleToUnitGroups: UnitGroup[],
  attackUnitGroups: UnitGroup[],
  attackId: Attack['id'],
  unitTypes: UnitType[],
  attackDate: Date,
  distance: number
) {
  const {
    attackUpdateModels,
    defenceUpdateModels
  } = getAttackUpdateModels(attackUnitGroups, castleToUnitGroups, unitTypes)

  const hasTroopsToReturn = attackUpdateModels.some(({ newAmount }) => !!newAmount)

  const updateUnitGroupsOperations = [
    ...attackUpdateModels,
    ...defenceUpdateModels
  ].map(getUnitGroupUpdateAmountOperation)

  const attackOperation = !hasTroopsToReturn
    ? attackDeleteOperation(attackId)
    : getAttackUpdateReturningDateOperation(
      attackId,
      attackDate,
      getLeftAttackUpdateUnitTypes(attackUpdateModels, attackUnitGroups, unitTypes),
      distance
    )

  callFormattedConsoleLog('Attack exec', 'info', {
    attackId,
    distance,
    hasTroopsToReturn,
    attackUpdateModels,
    defenceUpdateModels
  })

  return [
    ...updateUnitGroupsOperations,
    attackOperation
  ]
}

function getAttackReturningOperations(
  attackId: Attack['id'],
  homeCastleUnitGroups: UnitGroup[],
  attackUnitGroups: UnitGroup[],
  unitTypes: UnitType[],
  homeCastleId: Castle['id']
) {
  const updateAmountModels: UnitGroupUpdateAmountModel[] = []
  // const deleteModels: TUnitGroupDeleteModel[] = []
  const createModels: UnitGroupCreateModel[] = []

  unitTypes.forEach((unitType) => {
    const foundHomeUnitGroup = getUnitGroupByUnitType(homeCastleUnitGroups, unitType)
    const foundAttackUnitGroup = getUnitGroupByUnitType(attackUnitGroups, unitType)

    const foundHomeAndAttackGroups = foundHomeUnitGroup && foundAttackUnitGroup
    const foundOnlyAttackGroup = !foundHomeUnitGroup && foundAttackUnitGroup

    if (foundHomeAndAttackGroups) {
      updateAmountModels.push({
        oldAmount: foundHomeUnitGroup.amount,
        newAmount: foundHomeUnitGroup.amount + foundAttackUnitGroup.amount,
        unitGroupId: foundHomeUnitGroup.id,
        unitTypeId: unitType.id
      })
    }

    if (foundOnlyAttackGroup) {
      createModels.push({
        amount: foundAttackUnitGroup.amount,
        ownerCastleId: homeCastleId,
        unitTypeId: foundAttackUnitGroup.unitTypeId
      })
    }
  })

  callFormattedConsoleLog('Attack returning', 'info', {
    attackId,
    updateAmountModels,
    createModels
  })

  return [
    ...updateAmountModels.map(getUnitGroupUpdateAmountOperation),
    ...createModels.map(getUnitGroupCreateOperation),
    attackDeleteOperation(attackId)
  ]
}

async function emitSocketEvents(attacks: Awaited<ReturnType<typeof findAttacks>>) {
  return Promise.all(attacks.map(({ castleToId, castleFromId }) => (
    broadcastSocketsEvent(
      SocketAction.ATTACKS_UPDATED,
      ({ selectedCastleId }) => [castleToId, castleFromId].includes(selectedCastleId)
    )
  )))
}

export async function attacksProcessingTick() {
  const foundAttacks = await findAttacks()
  const unitTypes = await findUnitTypes()

  const operations = foundAttacks.reduce((result, {
    isReturning,
    castleTo,
    castleFrom,
    dateTime,
    id: attackId,
    unitGroups: attackUnitGroups
  }) => {
    const distance = calculateDistanceBetweenPoints(
      castleFrom.x,
      castleFrom.y,
      castleTo.x,
      castleTo.y
    )
    const { unitGroups: castleToUnitGroups } = castleTo
    const { unitGroups: castleFromUnitGroups, id: castleFromId } = castleFrom

    return [
      ...result,
      ...(
        isReturning
          ? getAttackReturningOperations(
            attackId,
            castleFromUnitGroups,
            attackUnitGroups,
            unitTypes,
            castleFromId
          )
          : [
            ...getAttackOperations(
              castleToUnitGroups,
              attackUnitGroups,
              attackId,
              unitTypes,
              dateTime,
              distance
            ),
            prepareCreateAttacksHistoryOperation(
              castleFrom.id,
              castleTo.id,
              attackUnitGroups,
              castleToUnitGroups,
              unitTypes,
              dateTime
            )
          ]
      )
    ]
  }, [])

  await prisma.$transaction(operations)

  await emitSocketEvents(foundAttacks)
}
