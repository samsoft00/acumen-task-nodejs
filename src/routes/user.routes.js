import { Router } from 'express'

import UserController from '../controller/user.controller'

const routes = Router()

/**
 * Account
 * 1. Registration & Verification
 * 2. Login using email/username and password
 */

routes.post('/register', UserController.createAccount)
routes.post('/verify/:token', UserController.verifyAccount)

export default routes
