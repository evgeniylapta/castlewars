import httpStatus from 'http-status'
import { validate, ValidationError } from 'class-validator'
import { Request, Response } from 'express'
import ApiError from '../utils/ApiError'

// eslint-disable-next-line @typescript-eslint/ban-types
async function getErrors(
  Constructor: new () => object,
  objectToValidate: object
): Promise<ValidationError[]> {
  const keys = Object.keys(objectToValidate)

  if (!keys.length || !Constructor) {
    return []
  }

  const model = new Constructor()
  keys.forEach((key) => {
    model[key] = objectToValidate[key]
  })

  return validate(model)
}

type ValidateRequestConfig = {
  BodyDto?: new () => object,
  QueryDto?: new () => object,
  ParamsDto?: new () => object
}

const validateRequest = (
  { BodyDto, QueryDto, ParamsDto }: ValidateRequestConfig
) => async (req: Request, res: Response, next) => {
  const errors: ValidationError[] = [
    ...await getErrors(BodyDto, req.body),
    ...await getErrors(QueryDto, req.query),
    ...await getErrors(ParamsDto, req.params)
  ]

  if (errors.length) {
    const message = errors
      .reduce((result, current) => [
        ...result,
        ...Object.values(current.constraints)
      ], [])
      .join(', ')

    return next(new ApiError(httpStatus.BAD_REQUEST, message))
  }

  return next()
}

export default validateRequest
