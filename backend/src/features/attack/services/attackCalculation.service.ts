import { UnitGroup, UnitType } from '@prisma/client'
import { getUnitTypeById } from '../../unitType/unitType.service'
import { UnitGroupUpdateAmountModel } from '../../unitGroup/types'

function calculateAttackValueByUnitGroups(unitGroups: UnitGroup[], unitTypes: UnitType[]) {
  return unitGroups.reduce((result, { amount, unitTypeId }) => {
    const unitType = getUnitTypeById(unitTypes, unitTypeId)

    const value = unitType.attack * amount

    return result + value
  }, 0)
}

function calculateDefenceValueByUnitGroups(unitGroups: UnitGroup[], unitTypes: UnitType[]) {
  return unitGroups.reduce<number>((result, { amount, unitTypeId }) => {
    const unitType = getUnitTypeById(unitTypes, unitTypeId)

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

function getUnitGroupsAlteringModels(
  unitGroups: UnitGroup[],
  survivedCoefficient: number
) {
  const updateModels: UnitGroupUpdateAmountModel[] = []

  unitGroups.forEach(({ amount, id, unitTypeId }) => {
    const newAmount = Math.max(Math.floor(amount * survivedCoefficient), 0)
    updateModels.push({
      unitGroupId: id,
      newAmount,
      oldAmount: amount,
      unitTypeId
    })
  })

  return {
    updateModels
  }
}

export function getAttackUpdateModels(
  attackUnitGroups: UnitGroup[],
  castleToUnitGroups: UnitGroup[],
  unitTypes: UnitType[]
) {
  //todo move?
  const attackSum = calculateAttackValueByUnitGroups(attackUnitGroups, unitTypes)
  const defenceSum = calculateDefenceValueByUnitGroups(castleToUnitGroups, unitTypes)

  const {
    attackSurvivedCoefficient,
    defenceSurvivedCoefficient
  } = calculateSurvivedCoefficients(attackSum, defenceSum)

  const {
    updateModels: attackUpdateModels
  } = getUnitGroupsAlteringModels(
    attackUnitGroups,
    attackSurvivedCoefficient
  )

  const { updateModels: defenceUpdateModels } = getUnitGroupsAlteringModels(
    castleToUnitGroups,
    defenceSurvivedCoefficient
  )

  return {
    attackUpdateModels,
    defenceUpdateModels
  }
}
