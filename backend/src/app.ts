import express from 'express'
import helmet from 'helmet'
import xss from 'xss-clean'
import 'reflect-metadata'
import compression from 'compression'
import cors from 'cors'
import httpStatus from 'http-status'
import passport from 'passport'
import http from 'http'
import ApiError from './utils/ApiError'
import routes from './routes'
import { errorConverter, errorHandler } from './middlewares/error'
import { jwtStrategy } from './config/passport'
import { startSocketsServer } from './features/sockets/socketsInitService'

const app = express()
const server = http.createServer(app)

// app.get('/test', (req, res) => {
//   res.send('test')
// })

// if (config.env !== 'test') {
//   app.use(morgan.successHandler);
//   app.use(morgan.errorHandler);
// }

// set security HTTP headers
app.use(helmet())

// parse json request body
app.use(express.json())

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }))

// sanitize request data
app.use(xss())

// gzip compression
app.use(compression())

// enable cors
app.use(cors())
app.options('*', cors())

// jwt authentication
app.use(passport.initialize())
passport.use('jwt', jwtStrategy)

// limit repeated failed requests to auth endpoints
// if (config.env === 'production') {
//   app.use('/v1/auth', authLimiter);
// }

// v1 api routes
app.use('/api/v1', routes)

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'))
})

app.use(errorConverter)

app.use(errorHandler)

startSocketsServer(server)

export default server
