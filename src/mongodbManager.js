import { MongoClient } from "mongodb";
import log from "fancy-log";

const MONGODB_URI = "mongodb://localhost:27017";
const MONGODB_NAME = "engage";

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
    log("Database connected!");
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
}
