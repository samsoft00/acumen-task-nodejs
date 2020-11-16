import { isNull } from 'lodash'
import UserRepo from '../repos/user.repo'

export default class UserController {
  /**
   * Update logged in seller's city or/and state.
   * Should return new seller city and state as response
   */
  static async updateAccount (req, res, next) {
    // udpdate seller's city or/and state
    const { seller_city, seller_state } = req.body

    try {
      if (isNull(seller_city) || isNull(seller_state)) { throw new Error('Seller city and state are required!') }

      const { seller_id } = req.user

      const { value } = await UserRepo.updateUser(seller_id, {
        ...req.user,
        seller_city,
        seller_state
      })

      // return seller city and state as response
      return res.status(200).json({
        seller_city: value.seller_city,
        seller_state: value.seller_state
      })
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message
      })
    }
  }
}
