import { pick } from 'lodash'
import crypto from 'crypto'
import Joi, { ValidationError } from 'joi'
import jwt from 'jsonwebtoken'
import FirestoreManager from '../firestoreManager'

export default class UserController {
  /**
   * User registration
   */
  static async createAccount (req, res, next) {
    const payload = pick(req.body, ['first_name', 'last_name', 'email', 'username', 'password', 'dob', 'gender'])

    try {
      const userValidatn = {
        first_name: Joi.string()
          .min(3)
          .required()
          .error(new ValidationError('First name must be at least 5 characters long')),
        last_name: Joi.string()
          .min(3)
          .required()
          .error(new ValidationError('Last name must be at least 5 characters long')),
        email: Joi.string()
          .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
          .required()
          .error((errors) => {
            return new ValidationError(errors.map((err) => err).join(' and '))
          }),
        username: Joi.string()
          .min(6)
          .max(20)
          .required()
          .error(new ValidationError('Username is required and must be atleast 6 characters long!')),
        password: Joi.string()
          .regex(/^[a-zA-Z0-9!@#$%&*]{3,25}$/)
          .required()
          .error(new ValidationError('Invalid password, special character is not allow!')),
        dob: Joi.date()
          .format('YYYY-MM-DD')
          .required()
          .error(new ValidationError('Date of birth must be in YYYY-MM-DD format')),
        gender: Joi.string()
          .valid('female', 'male')
          .required()
          .error(new ValidationError('Gender required, must be either male or female'))
      }

      const schema = Joi.object(userValidatn)
      await schema.validateAsync(payload)

      const firestore = FirestoreManager.getInstance()
      const db = firestore.getDbClient()

      const res = await db.collection('user').doc(crypto.randomBytes(16)).set({
        ...payload,
        verified: false
      })
      // generate verification token
      const token = jwt.sign({
        email: payload.email
      }, process.env.AES_KEY)

      return res.status(200).json({
        status: 'SUCCESS',
        message: `Verification token has been sent to ${payload.email}.`,
        token: token
      })
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message
      })
    }
  }

  static async verifyAccount (req, res, next) {
    try {
      const decode = jwt.verify(req.params.token, process.env.AES_KEY)
      if (!decode) throw new Error('Invalid verification token')

      const firestore = FirestoreManager.getInstance()
      const db = firestore.getDbClient()

      const user = await db.collection('users').where('email', '=', decode.email).get()
      if (!user) throw new Error('User not found!')

      await user.update({ verified: true })

      return res.status(200).json({
        status: 'SUCCESS',
        message: 'Registration succesfull.'
      })
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message
      })
    }
  }

  static async loginUser (req, res, next) {
    try {
      const payload = pick(req.body, ['username', 'password'])
      const validateUser = {
        username: Joi.string()
          .min(6)
          .max(20)
          .required()
          .error(new ValidationError('Username is required and must be atleast 6 characters long!')),
        password: Joi.string()
          .regex(/^[a-zA-Z0-9!@#$%&*]{3,25}$/)
          .required()
          .error(new ValidationError('Invalid password, special character is not allow!'))
      }

      const schema = Joi.object(validateUser)
      await schema.validateAsync(payload)

      const firestore = FirestoreManager.getInstance()
      const db = firestore.getDbClient()

      const data = await db.collection('users').where('email', '=', payload.username).get()
      if (!data.exists) throw new Error('User not found')

      return res.status(200).json({
        user: data,
        status: 'SUCCESS',
        message: 'Login succesfull.'
      })
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message
      })
    }
  }
}
