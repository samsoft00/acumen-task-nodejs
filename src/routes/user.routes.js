import { Router } from 'express'

import { authMiddleware } from '../middlewares/auth.middleware'
import UserController from '../controller/user.controller'

const routes = Router()

routes.put('/account', authMiddleware, UserController.updateAccount)

export default routes
