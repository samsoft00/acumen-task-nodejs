import MongoDbManager from "../mongodbManager";

const authMiddleware = async (req, res, next) => {
  try {
    if (
      !req.headers.authorization ||
      req.headers.authorization.indexOf("Basic ") === -1
    ) {
      return res.status(401).json({ message: "Missing Authorization Header" });
    }

    const b64auth = req.headers.authorization.split(" ")[1];
    const [seller_id, seller_zip_code_prefix] = Buffer.from(b64auth, "base64")
      .toString()
      .split(":");

    const dbManager = MongoDbManager.getInstance();
    const dbClient = dbManager.getDbClient();

    const query = {
      $and: [{ seller_id }, { seller_zip_code_prefix }],
    };
    const results = await dbClient.collection("sellers").findOne(query);

    if (results) {
      const user = {
        ...results,
      };
      req.user = user;
      return next();
    }

    return res
      .status(401)
      .json({ message: "Invalid Authentication Credentials" });
  } catch (error) {}
};

export { authMiddleware };
