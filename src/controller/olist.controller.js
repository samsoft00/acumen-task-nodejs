import OlistRepo from '../repos/olist.repo'

// Olist controller
export default class OlistController {
  /**
   * List all order items that belong to the logged in user.
   * Allow sorting by price or shipping_limit_date (default)
   */
  static async getOrderItems (req, res, next) {
    const { seller_id } = req.user

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 2
    const offset = parseInt(page - 1, 10) * limit

    const sort = { price: 1 }

    try {
      const results = await OlistRepo.getOrders(seller_id, {
        limit,
        offset,
        sort
      })

      return res.status(200).json(Object.assign(results, { limit, offset }))
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message
      })
    }
  }

  /**
   * Delete an order item ID from the order items collection
   */
  static async deleteOrderById (req, res, next) {
    const { id: orderId } = req.params

    try {
      await OlistRepo.orderById(orderId)

      return res
        .status(200)
        .json({ message: `Order items with ID ${orderId} deleted` })
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message
      })
    }
  }
}
