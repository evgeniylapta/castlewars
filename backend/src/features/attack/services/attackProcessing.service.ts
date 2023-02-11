import { prisma } from '../../../config/prisma';
import {
  findUnitGroupByUnitType,
  TUnitGroupUpdateAmountModel,
  getUnitGroupUpdateAmountOperation,
  TUnitGroupCreateModel, getUnitGroupCreateOperation
} from '../../unit/services/unitGroup.service';
import { UnitGroup, UnitType, Attack, Castle } from '@prisma/client'
import { add } from 'date-fns';
import { findUnitTypes, getUnitTypesMovingSeconds } from '../../unit/services/unitType.service';
import { callFormattedConsoleLog } from '../../../utils/console';
import { calculateDistanceBetweenPoints } from 'sharedUtils';

function findUnitTypeById (unitTypes: UnitType[], unitTypeId: string) {
  return unitTypes.find(({ id }) => id === unitTypeId)
}

function calculateAttackValueByUnitGroups(unitGroups: UnitGroup[], unitTypes: UnitType[]) {
  return unitGroups.reduce((result, { amount, unitTypeId }) => {
    const unitType = findUnitTypeById(unitTypes, unitTypeId)

    const value = unitType.attack * amount

    return result + value
  }, 0)
}

function calculateDefenceValueByUnitGroups(unitGroups: UnitGroup[], unitTypes: UnitType[]) {
  return unitGroups.reduce<number>((result, { amount, unitTypeId }) => {
    const unitType = findUnitTypeById(unitTypes, unitTypeId)

    const value = unitType.defence * amount

    return result + value
  }, 0)
}

function calculateSurvivedCoefficients(attackSum: number, defenceSum: number) {
  const attackCoefficient = attackSum / defenceSum;
  const defenceCoefficient = defenceSum / attackSum;

  const attackLosses = (attackSum / 2) * defenceCoefficient;
  const defenceLosses = (defenceSum / 2) * attackCoefficient;

  return {
    attackSurvivedCoefficient: ((attackSum - attackLosses) /  attackSum) || 0,
    defenceSurvivedCoefficient: ((defenceSum - defenceLosses) / defenceSum) || 0
  }
}

function getAttackDeleteOperation(attackId: Attack['id']) {
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
      seconds: getUnitTypesMovingSeconds(attackUnitTypesLeft, distance)
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
function getUnitGroupsAlteringModels(
  unitGroups: UnitGroup[],
  survivedCoefficient: number,
  // removeOnEmpty = false
) {
  const updateModels: TUnitGroupUpdateAmountModel[] = []

  unitGroups.forEach(({amount, id}) => {
    const newAmount = Math.max(Math.floor(amount * survivedCoefficient), 0)
    updateModels.push({ unitGroupId: id, newAmount, oldAmount: amount })
  })

  return {
    // deleteModels,
    updateModels
  }
}

function getLeftAttackUpdateUnitTypes(
  attackUpdateModels: TUnitGroupUpdateAmountModel[],
  attackUnitGroups: UnitGroup[],
  unitTypes: UnitType[]
) {
  return attackUnitGroups
    .filter(({ id }) => attackUpdateModels.some(({ unitGroupId }) => unitGroupId === id))
    .map(({ unitTypeId }) => findUnitTypeById(unitTypes, unitTypeId))
}

async function getAttacks() {
  return await prisma.attack.findMany({
    where: {
      dateTime: {
        lte: new Date()
      },
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
  const attackSum = calculateAttackValueByUnitGroups(attackUnitGroups, unitTypes)
  const defenceSum = calculateDefenceValueByUnitGroups(castleToUnitGroups, unitTypes)

  const {
    attackSurvivedCoefficient,
    defenceSurvivedCoefficient
  } = calculateSurvivedCoefficients(attackSum, defenceSum)

  const {
    updateModels: attackUpdateModels,
    // deleteModels: attackUnitGroupIdsToDelete
  } = getUnitGroupsAlteringModels(
    attackUnitGroups,
    attackSurvivedCoefficient,
    // true
  )

  const { updateModels: defenceUpdateModels } = getUnitGroupsAlteringModels(
    castleToUnitGroups,
    defenceSurvivedCoefficient,
    // false
  )

  const hasTroopsToReturn = !!attackUpdateModels.length;

  // todo
  // const deleteUnitGroupsOperations = [
  //   ...attackUnitGroupIdsToDelete
  // ].map(getUnitGroupDeleteOperation)

  const updateUnitGroupsOperations = [
    ...attackUpdateModels,
    ...defenceUpdateModels
  ].map(getUnitGroupUpdateAmountOperation)

  // todo cascade remove unitGroups on attack remove
  const attackOperation = !hasTroopsToReturn
    ? getAttackDeleteOperation(attackId)
    : getAttackUpdateReturningDateOperation(
      attackId,
      attackDate,
      getLeftAttackUpdateUnitTypes(attackUpdateModels, attackUnitGroups, unitTypes),
      distance
    )

  callFormattedConsoleLog('[ATTACK EXEC]', {
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

function getAttackReturningOperations(
  attackId: Attack['id'],
  homeCastleUnitGroups: UnitGroup[],
  attackUnitGroups: UnitGroup[],
  unitTypes: UnitType[],
  homeCastleId: Castle['id']
) {
  const updateAmountModels: TUnitGroupUpdateAmountModel[] = []
  // const deleteModels: TUnitGroupDeleteModel[] = []
  const createModels: TUnitGroupCreateModel[] = []

  unitTypes.forEach((unitType) => {
    const foundHomeUnitGroup = findUnitGroupByUnitType(homeCastleUnitGroups, unitType)
    const foundAttackUnitGroup = findUnitGroupByUnitType(attackUnitGroups, unitType)

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

    // if (foundAttackUnitGroup) {
    //   // todo remove, use cascade
    //   deleteModels.push({
    //     unitGroupId: foundAttackUnitGroup.id
    //   })
    // }
  })


  callFormattedConsoleLog('[ATTACK RETURNING]', {
    attackId,
    updateAmountModels,
    createModels,
    // deleteModels
  })

  return [
    ...updateAmountModels.map(getUnitGroupUpdateAmountOperation),
    ...createModels.map(getUnitGroupCreateOperation),
    // ...deleteModels.map(getUnitGroupDeleteOperation),
    getAttackDeleteOperation(attackId)
  ]
}

export async function attacksProcessingTick() {
  const foundAttacks = await getAttacks()
  const unitTypes = await findUnitTypes()

  const operations = foundAttacks.reduce((result, {
    isReturning,
    castleTo,
    castleFrom,
    dateTime,
    id: attackId,
    unitGroups: attackUnitGroups,
  }) => {
    const distance = calculateDistanceBetweenPoints(castleFrom.x, castleFrom.y, castleTo.x, castleTo.y)
    const { unitGroups: castleToUnitGroups } = castleTo
    const { unitGroups: castleFromUnitGroups, id: castleFromId } = castleFrom

    return [
      ...result,
      ...(
        isReturning
          ? getAttackReturningOperations(attackId, castleFromUnitGroups, attackUnitGroups, unitTypes, castleFromId)
          : getAttackOperations(castleToUnitGroups, attackUnitGroups, attackId, unitTypes, dateTime, distance)
      )
    ]
  }, [])

  await prisma.$transaction(operations)
}
