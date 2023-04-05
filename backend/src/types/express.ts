import { Request } from 'express';
import { User } from '@prisma/client';

export type CustomRequest<Auth = false, Body = object, Query = object, Params = object> =
  Request<Params, object, Body, Query> & { user: Auth extends true ? User : never }
