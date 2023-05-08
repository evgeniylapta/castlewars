import { PostCreateUnitsOrderDto } from './dto/PostCreateUnitsOrderDto'
import { createUnitOrderItems, findUnitOrderItemByCastleId } from './services/unitsOrder.service'
import { findUnitTypes } from '../unit/services/unitType.service'
import { GetUnitsOrdersDto } from './dto/GetUnitsOrdersDto'
import { CustomRequest } from '../../types/express'

export const getUnitsOrdersController = async (
  req: CustomRequest<false, undefined, GetUnitsOrdersDto>,
  res
) => {
  res.send(await findUnitOrderItemByCastleId(req.query.castleId))
}

// todo rename to unit order / troop order
export const createUnitsOrderingController = async (
  req: CustomRequest<false, PostCreateUnitsOrderDto>,
  res
) => {
  // todo check tribe type and unit type param
  // todo check available gold

  res.send(await createUnitOrderItems(await findUnitTypes(), req.body))
}
