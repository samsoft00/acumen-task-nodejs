import { Router } from 'express'

import CourseRoute from './course.routes'
import UserRoute from './user.routes'

const routes = Router()

routes.use('/course', CourseRoute)
routes.use('/account', UserRoute)

export default routes
