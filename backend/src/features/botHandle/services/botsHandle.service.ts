import { addSeconds } from 'date-fns'
import { SocketAction } from 'sharedUtils'
import { prisma } from '../../../config/prisma'
import { randomIntFromInterval } from '../../../utils/random'
import { findUnitTypes } from '../../unitType/unitType.service'
import { getTroopsSendOperations } from './troopsSending.service'
import { getOrderUnitsOperations } from './troopsOrdering.service'
import { callFormattedConsoleLog } from '../../../utils/console'
import { INTERVAL_BETWEEN_ACTIONS_SECONDS_RANGE } from '../config'
import { broadcastSocketsEvent } from '../../sockets/socketsInitService'

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
              unitsOrders: {
                include: {
                  items: true
                }
              }
            }
          },
          tribeType: true
        }
      }
    }
  })
}

async function emitSocketEvents(actions: Awaited<ReturnType<typeof findActionsToExecute>>) {
  return Promise.all(actions.map(({ user: { castles } }) => (
    broadcastSocketsEvent(
      [
        SocketAction.ATTACKS_UPDATED,
        SocketAction.UNITS_ORDERING_CHANGED,
        SocketAction.RESOURCES_CHANGED
      ],
      ({ selectedCastleId }) => castles.map(({ id }) => id).includes(selectedCastleId)
    )
  )))
}

export async function botsActionsExecuteTick() {
  const date = new Date()

  const actionsToPerform = await findActionsToExecute(date)
  const unitTypes = await findUnitTypes()

  let operations = []

  for (const action of actionsToPerform) {
    const { user: { castles: [castle], tribeType } } = action

    const { unitsOrders } = castle

    operations = [
      ...operations,
      ...await getOrderUnitsOperations(
        castle.castleResources,
        unitTypes,
        tribeType,
        unitsOrders.reduce((result, order) => (result + order.items.length), 0)
      ),
      ...await getTroopsSendOperations(
        castle.unitGroups,
        castle,
        tribeType,
        unitTypes
      )
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

  await emitSocketEvents(actionsToPerform)
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
    }
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
      })
    })
  })

  if (bots.length) {
    callFormattedConsoleLog('Bot create action', 'info', { actionsLength: bots.length })
  }
}
