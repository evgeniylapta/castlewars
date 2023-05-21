import { CustomRequest } from '../../types/express'
import { findResourcesByCastleId } from './resource.service'
import { GetResourcesQueryDto } from './dto/GetCastleDetailsQueryDto'

export const getResourcesController = async (
  req: CustomRequest<false, null, GetResourcesQueryDto>,
  res
) => {
  res.send(await findResourcesByCastleId(req.query.castleId))
}
