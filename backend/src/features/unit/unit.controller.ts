import { Request } from 'express';
import { PostCreateUnitOrderDto } from './dto/PostCreateUnitOrderDto';
import { createUnitOrderItem } from './services/unitsOrder.service';
import { findUnitTypeById } from './services/unitType.service';

// todo rename to unit order / troop order
export const postCreateUnitCreating = async (req: Request<object, object, PostCreateUnitOrderDto>, res) => {
  const { castleId, amount, unitTypeId } = req.body

  // todo check tribe type and unit type param
  // todo check available gold

  const unitType = await findUnitTypeById(unitTypeId)

  res.send(await createUnitOrderItem(unitType, castleId, amount));
};
