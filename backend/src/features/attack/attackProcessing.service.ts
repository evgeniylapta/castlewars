import { prisma } from '../../config/prisma';
import {
  findUnitTypes,
  getUnitTypesMovingMinutes,
  findUnitGroupByUnitType,
  TUnitGroupDeleteModel,
  TUnitGroupUpdateAmountModel,
  getUnitGroupDeleteOperation,
  getUnitGroupUpdateAmountOperation,
  TUnitGroupCreateModel, getUnitGroupCreateOperation
} from '../unit/unit.service';
import { UnitGroup, UnitType, Attack, Castle } from '@prisma/client'
import { calculateDistanceBetweenPoints } from '../castle/castle.service';
import { add } from 'date-fns';

const ATTACK_LOG_TYPE = 'Attack'
const DEFENCE_LOG_TYPE = 'Defence'
const ATTACK_RETURN_LOG_TYPE = 'Attack returning'

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
    attackSurvivedCoefficient: (attackSum - attackLosses) /  attackSum,
    defenceSurvivedCoefficient: (defenceSum - defenceLosses) / defenceSum
  }
}

function getAttackDeleteOperation(attackId: Attack['id'], type: string) {
  console.log(`[${type}]`, 'Attack to delete. Id:', attackId);

  return prisma.attack.delete({
    where: {
      id: attackId
    },
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
      minutes: getUnitTypesMovingMinutes(attackUnitTypesLeft, distance)
    }
  )

  console.log('Set attack returning. Id:', attackId, 'Old date:', attackDate, 'New Date:', newDate);

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

function getUnitGroupsAlteringModels(unitGroups: UnitGroup[], survivedCoefficient: number, type: string) {
  const deleteModels: TUnitGroupDeleteModel[] = []
  const updateModels: TUnitGroupUpdateAmountModel[] = []

  unitGroups.forEach(({amount, id}) => {
    const newAmount = survivedCoefficient <= 0 ? 0 : Math.floor(amount * survivedCoefficient)

    if (!newAmount) {
      deleteModels.push({ unitGroupId: id, type})

      return
    }

    updateModels.push({ unitGroupId: id, newAmount, type, oldAmount: amount })
  })

  return {
    deleteModels,
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
    deleteModels: attackUnitGroupIdsToDelete
  } = getUnitGroupsAlteringModels(
    attackUnitGroups,
    attackSurvivedCoefficient,
    ATTACK_LOG_TYPE
  )

  const {
    updateModels: defenceUpdateModels,
    deleteModels: defenceUnitGroupIdsToDelete
  } = getUnitGroupsAlteringModels(
    castleToUnitGroups,
    defenceSurvivedCoefficient,
    DEFENCE_LOG_TYPE
  )

  const hasTroopsToReturn = attackUpdateModels.length;

  const deleteUnitGroupsOperations = [
    ...attackUnitGroupIdsToDelete,
    ...defenceUnitGroupIdsToDelete
  ].map(getUnitGroupDeleteOperation)

  const updateUnitGroupsOperations = [
    ...attackUpdateModels,
    ...defenceUpdateModels
  ].map(getUnitGroupUpdateAmountOperation)

  const attackOperation = !hasTroopsToReturn
    ? getAttackDeleteOperation(attackId, ATTACK_LOG_TYPE)
    : getAttackUpdateReturningDateOperation(
      attackId,
      attackDate,
      getLeftAttackUpdateUnitTypes(attackUpdateModels, attackUnitGroups, unitTypes),
      distance
    )

  return [
    ...deleteUnitGroupsOperations,
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
  const updateAmountModels: TUnitGroupUpdateAmountModel[] = []
  const deleteModels: TUnitGroupDeleteModel[] = []
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
        unitGroupId: foundHomeUnitGroup.id,
        type: ATTACK_RETURN_LOG_TYPE
      })
    }

    if (foundOnlyAttackGroup) {
      createModels.push({
        amount: foundAttackUnitGroup.amount,
        type: ATTACK_RETURN_LOG_TYPE,
        ownerCastleId: homeCastleId,
        unitTypeId: foundAttackUnitGroup.unitTypeId
      })
    }

    if (foundAttackUnitGroup) {
      // todo remove, use cascade
      deleteModels.push({
        unitGroupId: foundAttackUnitGroup.id,
        type: ATTACK_RETURN_LOG_TYPE
      })
    }
  })

  return [
    ...updateAmountModels.map(getUnitGroupUpdateAmountOperation),
    ...createModels.map(getUnitGroupCreateOperation),
    ...deleteModels.map(getUnitGroupDeleteOperation),
    getAttackDeleteOperation(attackId, ATTACK_RETURN_LOG_TYPE)
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

export function startAttacksProcessing() {
  setInterval(() => {
    attacksProcessingTick()
  }, 2000)
}
