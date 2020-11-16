import log from "fancy-log";

import Engage from "./app";
import MongoDbManager from "./mongodbManager";
import OlistRepo from "./repos/olist.repo";

const dbManager = MongoDbManager.getInstance();

const dataLoader = async () => {
  try {
    await dbManager.connectDb();

    const db = dbManager.getDbClient();

    const results = await db.collection("order_items").findOne();

    if (!results) {
      const orderItems = "olist_order_items_dataset.csv";
      const productItems = "olist_products_dataset.csv";
      const sellerItems = "olist_sellers_dataset.csv";

      const orders = await OlistRepo.loadData(orderItems);
      const products = await OlistRepo.loadData(productItems);
      const sellers = await OlistRepo.loadData(sellerItems);

      await db.collection("order_items").insertMany(orders);
      await db.collection("products").insertMany(products);
      await db.collection("sellers").insertMany(sellers);

      log("Data seeded!");
    }
    //
  } catch (error) {
    await dbManager.dropDatabase();
    await dbManager.close();
  }
};

const port =
  parseInt(process.env.NODE_ENV === "test" ? 8378 : process.env.PORT, 10) ||
  8000;

export const server = Engage.listen(port, async () => {
  await dataLoader();
  log(`Server is running on http://localhost:${port} `);
});
