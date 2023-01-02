import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { ValidationError } from 'class-validator/types/validation/ValidationError';

async function getErrors(Constructor: any, object: any): Promise<ValidationError[]> {
  const keys = Object.keys(object)

  if (!keys.length || !Constructor) {
    return []
  }

  const model = new Constructor()
  keys.forEach((key) => {
    model[key] = object[key]
  })

  return await validate(model)
}

const validateGuard = (
  { Body, Query, Params }: { Body?: () => void, Query?: () => void, Params?: () => void }
) => async (req: Request, res: Response, next) => {

  const errors: ValidationError[] = [
    ...await getErrors(Body, req.body),
    ...await getErrors(Query, req.query),
    ...await getErrors(Params, req.params),
  ]

  if (errors.length) {
    const message = errors
      .reduce((result, current) => [
        ...result,
        ...Object.values(current.constraints)
      ], [])
      .join(', ')

    return next(new ApiError(httpStatus.BAD_REQUEST, message));
  }

  return next();
};

export default validateGuard;
