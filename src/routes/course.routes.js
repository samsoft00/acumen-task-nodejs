import { Router } from 'express'

import CourseController from '../controller/course.controller'

const routes = Router()

routes.post('/courses', CourseController.createEnrollment)

routes.get('/courses', CourseController.getCourses)

routes.delete('/course/:id', CourseController.deleteCourse)

export default routes
