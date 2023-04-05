import {
  UnitGroup, UnitType, Attack, Castle
} from '@prisma/client'
import { add } from 'date-fns'
import { calculateDistanceBetweenPoints, unitTypesMovingSeconds } from 'sharedUtils'
import { prisma } from '../../../config/prisma'
import {
  unitGroupByUnitType,
  UnitGroupUpdateAmountModel,
  unitGroupUpdateAmountOperation,
  UnitGroupCreateModel, unitGroupCreateOperation
} from '../../unit/services/unitGroup.service'
import { unitTypes as findUnitTypes } from '../../unit/services/unitType.service'
import { callFormattedConsoleLog } from '../../../utils/console'

function unitTypeById(unitTypes: UnitType[], unitTypeId: string) {
  return unitTypes.find(({ id }) => id === unitTypeId)
}

function calculateAttackValueByUnitGroups(unitGroups: UnitGroup[], unitTypes: UnitType[]) {
  return unitGroups.reduce((result, { amount, unitTypeId }) => {
    const unitType = unitTypeById(unitTypes, unitTypeId)

    const value = unitType.attack * amount

    return result + value
  }, 0)
}

function calculateDefenceValueByUnitGroups(unitGroups: UnitGroup[], unitTypes: UnitType[]) {
  return unitGroups.reduce<number>((result, { amount, unitTypeId }) => {
    const unitType = unitTypeById(unitTypes, unitTypeId)

    const value = unitType.defence * amount

    return result + value
  }, 0)
}

function calculateSurvivedCoefficients(attackSum: number, defenceSum: number) {
  const attackCoefficient = attackSum / defenceSum
  const defenceCoefficient = defenceSum / attackSum

  const attackLosses = (attackSum / 2) * defenceCoefficient
  const defenceLosses = (defenceSum / 2) * attackCoefficient

  return {
    attackSurvivedCoefficient: ((attackSum - attackLosses) / attackSum) || 0,
    defenceSurvivedCoefficient: ((defenceSum - defenceLosses) / defenceSum) || 0
  }
}

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

function attackUpdateReturningDateOperation(
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

// todo only update
function unitGroupsAlteringModels(
  unitGroups: UnitGroup[],
  survivedCoefficient: number
  // removeOnEmpty = false
) {
  const updateModels: UnitGroupUpdateAmountModel[] = []

  unitGroups.forEach(({ amount, id }) => {
    const newAmount = Math.max(Math.floor(amount * survivedCoefficient), 0)
    updateModels.push({ unitGroupId: id, newAmount, oldAmount: amount })
  })

  return {
    // deleteModels,
    updateModels
  }
}

function leftAttackUpdateUnitTypes(
  attackUpdateModels: UnitGroupUpdateAmountModel[],
  attackUnitGroups: UnitGroup[],
  unitTypes: UnitType[]
) {
  return attackUnitGroups
    .filter(({ id }) => attackUpdateModels.some(({ unitGroupId }) => unitGroupId === id))
    .map(({ unitTypeId }) => unitTypeById(unitTypes, unitTypeId))
}

async function attacks() {
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

function attackOperations(
  castleToUnitGroups: UnitGroup[],
  attackUnitGroups: UnitGroup[],
  attackId: Attack['id'],
  unitTypes: UnitType[],
  attackDate: Date,
  distance: number
) {
  const attackSum = calculateAttackValueByUnitGroups(attackUnitGroups, unitTypes)
  const defenceSum = calculateDefenceValueByUnitGroups(castleToUnitGroups, unitTypes)

  const {
    attackSurvivedCoefficient,
    defenceSurvivedCoefficient
  } = calculateSurvivedCoefficients(attackSum, defenceSum)

  const {
    updateModels: attackUpdateModels
    // deleteModels: attackUnitGroupIdsToDelete
  } = unitGroupsAlteringModels(
    attackUnitGroups,
    attackSurvivedCoefficient
    // true
  )

  const { updateModels: defenceUpdateModels } = unitGroupsAlteringModels(
    castleToUnitGroups,
    defenceSurvivedCoefficient
    // false
  )

  const hasTroopsToReturn = !!attackUpdateModels.length

  // todo
  // const deleteUnitGroupsOperations = [
  //   ...attackUnitGroupIdsToDelete
  // ].map(getUnitGroupDeleteOperation)

  const updateUnitGroupsOperations = [
    ...attackUpdateModels,
    ...defenceUpdateModels
  ].map(unitGroupUpdateAmountOperation)

  // todo cascade remove unitGroups on attack remove
  const attackOperation = !hasTroopsToReturn
    ? attackDeleteOperation(attackId)
    : attackUpdateReturningDateOperation(
      attackId,
      attackDate,
      leftAttackUpdateUnitTypes(attackUpdateModels, attackUnitGroups, unitTypes),
      distance
    )

  callFormattedConsoleLog('Attack exec', 'info', {
    attackId,
    distance,
    hasTroopsToReturn,
    // attackUnitGroupIdsToDelete,
    attackUpdateModels,
    defenceUpdateModels
  })

  return [
    ...updateUnitGroupsOperations,
    // ...deleteUnitGroupsOperations,
    attackOperation
  ]
}

function attackReturningOperations(
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
    const foundHomeUnitGroup = unitGroupByUnitType(homeCastleUnitGroups, unitType)
    const foundAttackUnitGroup = unitGroupByUnitType(attackUnitGroups, unitType)

    const foundHomeAndAttackGroups = foundHomeUnitGroup && foundAttackUnitGroup
    const foundOnlyAttackGroup = !foundHomeUnitGroup && foundAttackUnitGroup

    if (foundHomeAndAttackGroups) {
      updateAmountModels.push({
        oldAmount: foundHomeUnitGroup.amount,
        newAmount: foundHomeUnitGroup.amount + foundAttackUnitGroup.amount,
        unitGroupId: foundHomeUnitGroup.id
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
    ...updateAmountModels.map(unitGroupUpdateAmountOperation),
    ...createModels.map(unitGroupCreateOperation),
    attackDeleteOperation(attackId)
  ]
}

export async function attacksProcessingTick() {
  const foundAttacks = await attacks()
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
          ? attackReturningOperations(
            attackId,
            castleFromUnitGroups,
            attackUnitGroups,
            unitTypes,
            castleFromId
          )
          : attackOperations(
            castleToUnitGroups,
            attackUnitGroups,
            attackId,
            unitTypes,
            dateTime,
            distance
          )
      )
    ]
  }, [])

  await prisma.$transaction(operations)
}
