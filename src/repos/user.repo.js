import MongoDbManager from "../mongodbManager";

function UserRepo() {
  function updateUser(seller_id, toUpdate) {
    return new Promise(async (resolve, reject) => {
      try {
        const dbManager = MongoDbManager.getInstance();
        const dbClient = dbManager.getDbClient();

        const result = await dbClient.collection("sellers").findOneAndUpdate(
          { seller_id: { $eq: seller_id } },
          { $set: toUpdate },
          {
            returnOriginal: false,
          }
        );

        resolve(result);
      } catch (error) {
        return reject(error);
      }
    });
  }

  return { updateUser };
}

export default UserRepo();
