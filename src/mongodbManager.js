import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const MONGODB_NAME = process.env.MONGODB_NAME || "engage";

/**
 * Mongodb Manager v1.0
 * Oyewole Abayomi
 * Github @samsoft00
 */
export default class MongodbManager {
  static getInstance() {
    if (!MongodbManager.instance) {
      MongodbManager.instance = new MongodbManager();
    }

    return MongodbManager.instance;
  }

  async connectDb() {
    this._client = new MongoClient(MONGODB_URI, { useUnifiedTopology: true });
    await this._client.connect();
  }

  getDbClient() {
    if (!this._client) throw new Error("Mongodb client connection issue");
    return this._client.db(MONGODB_NAME);
  }

  async close() {
    if (this._client) {
      await this._client.close();
    }
  }

  async dropDatabase() {
    if (this._client) {
      await this._client.db(MONGODB_NAME).dropDatabase();
    }
  }
}
