import { Router } from 'express'

import OlistRoute from './olists.routes'
import UserRoute from './user.routes'

const routes = Router()

routes.use('/', OlistRoute)
routes.use('/', UserRoute)

export default routes
