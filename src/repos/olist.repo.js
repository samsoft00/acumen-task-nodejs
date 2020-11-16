import parse from 'csv-parse'
import log from 'fancy-log'
import { join } from 'path'
import { createReadStream } from 'fs'

import MongoDbManager from '../mongodbManager'

const srcPath = (...segments) => join(__dirname, '../../olists', ...segments)

function OlistRepo () {
  // seed data
  async function dataLoader () {
    const dbManager = MongoDbManager.getInstance()

    try {
      const db = dbManager.getDbClient()

      const results = await db.collection('order_items').findOne()

      if (!results) {
        const orderItems = 'olist_order_items_dataset.csv'
        const productItems = 'olist_products_dataset.csv'
        const sellerItems = 'olist_sellers_dataset.csv'

        const orders = await loadData(orderItems)
        const products = await loadData(productItems)
        const sellers = await loadData(sellerItems)

        await db.collection('order_items').insertMany(orders)
        await db.collection('products').insertMany(products)
        await db.collection('sellers').insertMany(sellers)

        log('Data seeded!')
      }
      //
    } catch (error) {
      console.log(error)
      await dbManager.dropDatabase()
      await dbManager.close()
    }
  }

  // load data from csv file
  function loadData (filePath) {
    return new Promise((resolve, reject) => {
      const inputFile = createReadStream(srcPath(filePath))

      const parser = parse({
        skip_lines_with_error: true,
        delimiter: ',',
        columns: true
      })

      const output = []

      inputFile
        .pipe(parser)
        .on('data', (chuck) => output.push(chuck))
        .on('error', (error) => reject(new Error(error.message || error)))
        .on('end', () => resolve(output))
    })
  }

  function getOrders (seller_id, query) {
    return new Promise(async (resolve, reject) => {
      try {
        const { limit, offset, sort } = query

        const findQuery = [
          { $match: { seller_id: { $eq: seller_id } } },
          {
            $facet: {
              metadata: [{ $count: 'total' }],
              data: [
                { $sort: sort },
                { $skip: offset },
                { $limit: limit },
                {
                  $lookup: {
                    from: 'products',
                    localField: 'product_id',
                    foreignField: 'product_id',
                    as: 'product'
                  }
                },
                {
                  $unwind: {
                    path: '$product',
                    preserveNullAndEmptyArrays: true
                  }
                },
                {
                  $group: {
                    _id: null,
                    payload: {
                      $push: {
                        id: '$order_item_id',
                        product_id: '$product_id',
                        product_category: '$product.product_category_name',
                        price: '$price',
                        date: '$shipping_limit_date'
                      }
                    }
                  }
                },
                {
                  $project: {
                    _id: 0,
                    payload: 1
                  }
                }
              ]
            }
          },

          {
            $project: {
              data: { $arrayElemAt: ['$data.payload', 0] },
              total: { $arrayElemAt: ['$metadata.total', 0] }
            }
          }
        ]

        const dbManager = MongoDbManager.getInstance()
        const dbClient = dbManager.getDbClient()

        const items = dbClient.collection('order_items').aggregate(findQuery)
        const r = await items.toArray()

        return resolve(r[0])
      } catch (error) {
        return reject(error)
      }
    })
  }

  function orderById (order_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const dbManager = MongoDbManager.getInstance()
        const dbClient = dbManager.getDbClient()

        const removeItem = await dbClient
          .collection('order_items')
          .deleteOne({ order_id: { $eq: order_id } }, { justOne: true })

        resolve(removeItem)
      } catch (error) {
        reject(error)
      }
    })
  }

  return { dataLoader, loadData, getOrders, orderById }
}

export default OlistRepo()
