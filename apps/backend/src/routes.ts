import express from 'express'
import castleRouter from './features/castle/castle.route'
import attackRouter from './features/attack/attack.route'
import unitOrderRouter from './features/unitOrder/unitOrder.route'
import unitGroupRouter from './features/unitGroup/unitGroup.route'
import resourcesRouter from './features/resource/resource.route'
import authRouter from './features/auth/auth.route'
import dictionariesRouter from './features/dictionary/dictionary.route'
import userRouter from './features/user/user.route'
import config from './config/config'

const router = express.Router()

const defaultRoutes = [
  {
    path: '/castle',
    route: castleRouter
  },
  {
    path: '/dictionary',
    route: dictionariesRouter
  },
  {
    path: '/attack',
    route: attackRouter
  },
  {
    path: '/unit-order',
    route: unitOrderRouter
  },
  {
    path: '/unit-group',
    route: unitGroupRouter
  },
  {
    path: '/resource',
    route: resourcesRouter
  },
  {
    path: '/auth',
    route: authRouter
  },
  {
    path: '/user',
    route: userRouter
  }
]

// const devRoutes = [
//   // routes available only in development mode
//   {
//     path: '/docs',
//     route: docsRoute,
//   },
// ];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route)
})

/* istanbul ignore next */
if (config.env === 'development') {
  // devRoutes.forEach((route) => {
  //   router.use(route.path, route.route);
  // });
}

export default router
