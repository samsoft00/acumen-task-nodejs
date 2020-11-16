import MongoDbManager from '../mongodbManager'
import OlistRepo from '../repos/olist.repo';

/**
 * Migration file to setup database
 */

(async () => {
  const dbManager = MongoDbManager.getInstance()

  await dbManager.connectDb()

  await OlistRepo.dataLoader()

  await dbManager.close()
})()
