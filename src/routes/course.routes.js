import { Router } from 'express'

import CourseController from '../controller/course.controller'

const routes = Router()

routes.post('/courses', CourseController.createCourse)

routes.get('/courses', CourseController.getCourses)

routes.delete('/course/:id', CourseController.deleteCourse)

export default routes
