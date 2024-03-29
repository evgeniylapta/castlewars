import passport from 'passport'
import httpStatus from 'http-status'
import { roleRights, UserRight } from '../config/roles'
import ApiError from '../utils/ApiError'

const verifyCallback = (
  req,
  resolve,
  reject,
  requiredRights: UserRight[]
) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'))
  }

  req.user = user

  if (requiredRights.length) {
    const userRights = roleRights.get(user.role)
    const hasRequiredRights = requiredRights.every(
      (requiredRight) => userRights.includes(requiredRight)
    )
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'))
    }
  }

  resolve()
  return undefined
}

export const auth = (
  ...requiredRights: UserRight[]
) => async (req, res, next) => new Promise((resolve, reject) => {
  passport.authenticate(
    'jwt',
    { session: false },
    verifyCallback(req, resolve, reject, requiredRights)
  )(req, res, next)
})
  .then(() => next())
  .catch((err) => next(err))
