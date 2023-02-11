import { addSeconds } from 'date-fns';
import { prisma } from '../../../config/prisma';
import { randomIntFromInterval } from '../../../utils/random';
import { findUnitTypes } from '../../unit/services/unitType.service';
import { getTroopsSendOperations } from './troopsSending.service';
import { getOrderUnitsOperations } from './troopsOrdering.service';
import { callFormattedConsoleLog } from '../../../utils/console';
import { INTERVAL_BETWEEN_ACTIONS_SECONDS_RANGE } from '../config';

async function findActionsToExecute(date: Date) {
  return prisma.botAction.findMany({
    where: {
      date: {
        lte: date
      }
    },
    include: {
      user: {
        include: {
          castles: {
            include: {
              castleResources: true,
              unitGroups: true,
              unitsOrders: true,
            }
          },
          tribeType: true
        }
      }
    }
  })
}

export async function botsActionsExecuteTick() {
  const date = new Date()

  const actionsToPerform  = await findActionsToExecute(date)
  const unitTypes  = await findUnitTypes()

  let operations = []

  for (const action of actionsToPerform) {
    const { user: { castles: [castle], tribeType } } = action
    const orderUnitsOperations = await getOrderUnitsOperations(castle.castleResources, castle.unitsOrders, unitTypes, tribeType)
    const troopsSendOperations = await getTroopsSendOperations(castle.unitGroups, castle, tribeType, unitTypes)

    operations = [
      ...operations,
      ...orderUnitsOperations,
      ...troopsSendOperations
    ]
  }

  await prisma.$transaction([
    ...operations,
    prisma.botAction.deleteMany({
      where: {
        date: {
          lte: date
        }
      }
    })
  ])
}

async function findBotsWithNoActions() {
  return prisma.user.findMany({
    where: {
      isBot: true,
      botAction: {
        is: null
      }
    },
    include: {
      botAction: true,
      tribeType: true
    },
  })
}

export async function botsActionsCreatingTick() {
  const bots = await findBotsWithNoActions()

  const newDate = new Date()

  await prisma.botAction.createMany({
    data: bots.map(({ id }) => {
      const { min, max } = INTERVAL_BETWEEN_ACTIONS_SECONDS_RANGE
      const secondsToAdd = randomIntFromInterval(min, max)

      return ({
        userId: id,
        date: addSeconds(newDate, secondsToAdd)
      });
    })
  })

  callFormattedConsoleLog('[BOT CREATE ACTION]', { actionsLength: bots.length })
}
