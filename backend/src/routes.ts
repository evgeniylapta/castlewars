import express from 'express'
import castleRoute from './features/castle/castle.route'
import userRoute from './features/user/user.route'
import attackRoute from './features/attack/attack.route'
import unitOrderRoute from './features/unitOrder/unitOrder.route'
import unitGroupRoute from './features/unitGroup/unitGroup.route'
import resourcesRoute from './features/resource/resource.route'
import authRoute from './features/auth/auth.route'
import dictionariesRouter from './features/dictionary/dictionary.route'
import config from './config/config'

const router = express.Router()

const defaultRoutes = [
  {
    path: '/castle',
    route: castleRoute
  },
  {
    path: '/user',
    route: userRoute
  },
  {
    path: '/dictionary',
    route: dictionariesRouter
  },
  {
    path: '/attack',
    route: attackRoute
  },
  {
    path: '/unit-order',
    route: unitOrderRoute
  },
  {
    path: '/unit-group',
    route: unitGroupRoute
  },
  {
    path: '/resource',
    route: resourcesRoute
  },
  {
    path: '/auth',
    route: authRoute
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
