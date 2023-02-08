import { prisma } from '../../../config/prisma';
import { findUnitGroupsByCastleId } from '../../unit/services/unitGroup.service';
import { calculateDistanceBetweenCastles } from '../../castle/castle.service';
import { add } from 'date-fns';
import { findUnitTypes, getUnitTypesMovingMinutes } from '../../unit/services/unitType.service';
import { UnitType } from '@prisma/client';
import { TAttackCreationData } from '../types';

export async function findAttacksByUser(castleId: string) {
  return await prisma.attack.findMany({
    where: {
      OR: [
        {
          castleToId: castleId,
          isReturning: false
        },
        {
          castleFromId: castleId
        }
      ]
    },
    include: {
      unitGroups: true,
      castleFrom: {
        include: {
          user: true
        }
      },
      castleTo: {
        include: {
          user: true
        }
      }
    }
  });
}

export async function getCreateAttackOperations(castleFromId: string, castleToId: string, data: TAttackCreationData) {
  // todo validate if can substract

  const distance = await calculateDistanceBetweenCastles(castleFromId, castleToId)

  const getNewAmount = (unitTypeId) => data[unitTypeId]

  const unitTypes = await findUnitTypes()
  const requestUnitTypeKeys = Object.keys(data)
  const requestUnitTypes = requestUnitTypeKeys.map((key) => unitTypes.find(({ id }) => id === key))

  const minutesToDestination = getUnitTypesMovingMinutes(requestUnitTypes, distance)
  const destinationDate = add(new Date(), {
    minutes: minutesToDestination
  })

  const unitGroupsToUpdate = (await findUnitGroupsByCastleId(castleFromId))
    .filter(({ unitTypeId }) => requestUnitTypeKeys.includes(unitTypeId))

  // todo удалять если пустая группа

  return [
    prisma.attack.create({
      data: {
        castleToId,
        castleFromId,
        dateTime: destinationDate,
        unitGroups: {
          createMany: {
            data: requestUnitTypes.map(({ id }) => ({
              unitTypeId: id,
              amount: getNewAmount(id),
              ownerCastleId: null,
            }))
          }
        },
        isReturning: false
      }
    }),
    ...unitGroupsToUpdate.map(({ id, unitTypeId, amount }) => prisma.unitGroup.update({
      where: {
        id
      },
      data: {
        amount: amount - getNewAmount(unitTypeId)
      }
    }))
  ]
}

export async function createAttack(castleFromId: string, castleToId: string, data: TAttackCreationData) {
  await prisma.$transaction(await getCreateAttackOperations(castleFromId, castleToId, data))
}
