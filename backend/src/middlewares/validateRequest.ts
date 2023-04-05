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

const validateRequest = (
  { body, query, params }: { body?: object, query?: object, params?: object }
) => async (req: Request, res: Response, next) => {

  const errors: ValidationError[] = [
    ...await getErrors(body, req.body),
    ...await getErrors(query, req.query),
    ...await getErrors(params, req.params),
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

export default validateRequest;
