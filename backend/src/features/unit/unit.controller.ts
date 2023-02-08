import { Request } from 'express';
import { PostCreateUnitOrderDto } from './dto/PostCreateUnitOrderDto';
import { createOrUpdateUnitOrder } from './services/unitCreating.service';

// todo rename to unit order / troop order
export const postCreateUnitCreating = async (req: Request<object, object, PostCreateUnitOrderDto>, res) => {
  const { castleId, amount, unitTypeId } = req.body

  // todo check tribe type and unit type param

  res.send(await createOrUpdateUnitOrder(unitTypeId, castleId, amount));
};
