import got from 'got'
import crypto from 'crypto'
import { pick } from 'lodash'
import moment from 'moment'
import FirestoreManager from '../firestoreManager'

const COUSE_ENDPOINT = 'https://5ea5cbca2d86f00016b46276.mockapi.io/api/courses'

// Olist controller
export default class CourseController {
  /**
   * List Enrollments: API to list a student enrollments
   */
  static async getCourses (req, res, next) {
    try {
      const r = await got(COUSE_ENDPOINT, { throwHttpErrors: false, responseType: 'json' })
      if (r.statusCode !== 200) throw new Error('There was a problem with the course endpoint')

      const courses = r.body

      return res.status(200).json({
        courses: courses,
        status: 'SUCCESS',
        message: 'successful'
      })
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message
      })
    }
  }

  static async listEnrollment (req, res, next) {
    try {
      const firestore = FirestoreManager.getInstance()
      const db = firestore.getDbClient()

      const snapshot = await db.collection('courses').get()

      const res = snapshot.docs.map(doc => doc.data())

      return res.status(200).json({
        enrollments: res,
        status: 'SUCCESS',
        message: `You have ${res.length} enrollments`
      })
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message
      })
    }
  }

  /**
   * Create Enrollment: Students should be able to enroll in a course
   */
  static async createEnrollment (req, res, next) {
    try {
      const payload = pick(req.body, ['student_id', 'course_name'])

      const course = {
        ...payload,
        registration_date: moment(Date.now()).format('MM/DD/YYYY')
      }

      const firestore = FirestoreManager.getInstance()
      const db = firestore.getDbClient()

      const res = await db.collection('courses').doc(crypto.randomBytes(16)).set(course)

      return res.status(200).json({
        status: 'SUCCESS',
        message: 'Course enrollment successful'
      })
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message
      })
    }
  }

  /**
   * Delete Enrollment
   */
  static async deleteCourse (req, res, next) {
    try {
      // get
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message
      })
    }
  }
}
