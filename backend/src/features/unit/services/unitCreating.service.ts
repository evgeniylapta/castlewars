import { prisma } from '../../../config/prisma';
import { UnitType, Castle } from '@prisma/client';
import { asyncTimerStart } from '../../../utils/timer';

export async function createOrUpdateUnitOrder(
  unitTypeId: UnitType['id'],
  castleId: Castle['id'],
  amount: number,
  replace = false
) {
  const foundUnitCreating = await prisma.unitOrder.findFirst({
    where: {
      AND: {
        castleId,
        unitTypeId
      },
    }
  })

  if (foundUnitCreating) {
    await prisma.unitOrder.update({
      where: {
        id: foundUnitCreating.id
      },
      data: {
        amount: replace
          ? amount
          : foundUnitCreating.amount + amount
      }
    });
    return
  }

  return await prisma.unitOrder.create({
    data: {
      amount: amount,
      castleId,
      unitTypeId,
      createDate: new Date()
    }
  });
}

// export async function handleUnitOrders() {
//   const foundUnitCreating = await prisma.unitOrder.findMany({
//     where: {
//       createDate:
//     },
//     include: {
//       unitType: true
//     }
//   })
// }

// export async function handleUnitOrdersStart() {
//   await asyncTimerStart(() => handleUnitOrders(), 1000)
// }
