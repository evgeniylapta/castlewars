import express from 'express'
import castleRoute from './features/castle/castle.route'
import userRoute from './features/user/user.route'
import attackRoute from './features/attack/attack.route'
import unitsOrderRoute from './features/unitsOrder/unitsOrder.route'
import authRoute from './features/auth/auth.route'
import dictionariesRouter from './features/dictionaries/dictionaries.route'
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
    path: '/dictionaries',
    route: dictionariesRouter
  },
  {
    path: '/attack',
    route: attackRoute
  },
  {
    path: '/units-order',
    route: unitsOrderRoute
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
