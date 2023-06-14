import { PostCreateUnitsOrderDto } from './dto/PostCreateUnitsOrderDto'
import { createUnitOrderItems, findUnitOrderItemByCastleId } from './services/unitsOrder.service'
import { findUnitTypes } from '../unitType/unitType.service'
import { GetUnitsOrdersDto } from './dto/GetUnitsOrdersDto'
import { CustomRequest } from '../../types/express'

export const getUnitsOrdersController = async (
  req: CustomRequest<true, undefined, GetUnitsOrdersDto>,
  res
) => {
  res.send(await findUnitOrderItemByCastleId(req.query.castleId))
}

// todo rename to unit order / troop order
export const createUnitsOrderingController = async (
  req: CustomRequest<true, PostCreateUnitsOrderDto>,
  res
) => {
  // todo check tribe type and unit type param
  // todo check available gold

  res.send(await createUnitOrderItems(await findUnitTypes(), req.body))
}
