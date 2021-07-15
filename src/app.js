import '@babel/polyfill'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

import appRoutes from './routes'
require('dotenv').config()

const acumen = express()

const corsOptions = {
  credentials: true,
  origin: true,
  optionsSuccessStatus: 200
}

acumen.use(cors(corsOptions))
acumen.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
acumen.use(bodyParser.json())

// routes
acumen.use(appRoutes)

export default acumen
