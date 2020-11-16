import parse from "csv-parse";
import { join } from "path";
import { createReadStream } from "fs";

import MongoDbManager from "../mongodbManager";

const srcPath = (...segments) => join(__dirname, "../../olists", ...segments);

function OlistRepo() {
  // load data from csv file
  function loadData(filePath) {
    return new Promise((resolve, reject) => {
      const inputFile = createReadStream(srcPath(filePath));

      const parser = parse({
        skip_lines_with_error: true,
        delimiter: ",",
        columns: true,
      });

      const output = [];

      inputFile
        .pipe(parser)
        .on("data", (chuck) => output.push(chuck))
        .on("error", (error) => reject(new Error(error.message || error)))
        .on("end", () => resolve(output));
    });
  }

  function getOrders(seller_id, query) {
    return new Promise(async (resolve, reject) => {
      try {
        const { limit, offset, sort } = query;

        const findQuery = [
          { $match: { seller_id: { $eq: seller_id } } },

          {
            $lookup: {
              from: "products",
              localField: "product_id",
              foreignField: "product_id",
              as: "product",
            },
          },
          { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
          {
            $facet: {
              metadata: [{ $count: "total" }],
              data: [{ $sort: sort }, { $skip: offset }, { $limit: limit }],
            },
          },
          {
            $project: {
              data: 1,
              total: { $arrayElemAt: ["$metadata.total", 0] },
            },
          },
        ];

        const dbManager = MongoDbManager.getInstance();
        const dbClient = dbManager.getDbClient();

        const items = dbClient.collection("order_items").aggregate(findQuery);
        const r = await items.toArray();

        return resolve(r[0]);
      } catch (error) {
        return reject(error);
      }
    });
  }

  function orderById(order_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const dbManager = MongoDbManager.getInstance();
        const dbClient = dbManager.getDbClient();

        const removeItem = await dbClient
          .collection("order_items")
          .deleteOne({ order_id: { $eq: order_id } }, { justOne: true });

        resolve(removeItem);
      } catch (error) {
        reject(error);
      }
    });
  }

  return { loadData, getOrders, orderById };
}

export default OlistRepo();
