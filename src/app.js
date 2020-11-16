import '@babel/polyfill'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

import appRoutes from './routes'

const engage = express()

const corsOptions = {
  credentials: true,
  origin: true,
  optionsSuccessStatus: 200
}

engage.use(cors(corsOptions))
engage.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
engage.use(bodyParser.json())

// routes
engage.use(appRoutes)

export default engage
