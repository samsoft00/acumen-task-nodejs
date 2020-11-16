import request from "supertest";
import { expect } from "chai";

import MongoDbManager from "../mongodbManager";
import app from "../app";

const loggedSeller = {
  seller_id: "d1b65fc7debc3361ea86b5f14c68d2e2",
  seller_zip_code_prefix: "13844",
  seller_city: "campinas",
  seller_state: "SP",
};

const sellerToUpdate = {
  seller_city: "campinas update",
  seller_state: "SP update",
};

let olists = null;

describe("Olist", () => {
  const dbManger = MongoDbManager.getInstance();

  afterAll(async (done) => {
    await dbManger.dropDatabase();
    await dbManger.close();
    done();
  });

  beforeAll(async (done) => {
    await dbManger.connectDb();
    done();
  });

  describe("GET /order_items", () => {
    it("Return 401 if invalid credential", (done) => {
      request(app)
        .get("/order_items")
        .set("Content-Type", "application/json")
        .auth(loggedSeller.seller_id, "12855", {
          type: "basic",
        })
        .expect((res) => {
          res.body.message = "Invalid Authentication Credentials";
        })
        .expect(401, done);
    });

    it("fetch olist order items", (done) => {
      request(app)
        .get("/order_items")
        .set("Content-Type", "application/json")
        .auth(loggedSeller.seller_id, loggedSeller.seller_zip_code_prefix, {
          type: "basic",
        })
        .expect((res) => {
          olists = res.body.data[0];
          res.body.message = "Invalid Authentication Credentials";
        })
        .expect(200, done);
    });
  });

  describe("DELETE /order_items/:id", () => {
    it("Delete Olist items by order_id", (done) => {
      request(app)
        .delete(`/order_items/${olists.order_id}`)
        .set("Content-Type", "application/json")
        .auth(loggedSeller.seller_id, loggedSeller.seller_zip_code_prefix, {
          type: "basic",
        })
        .expect((res) => {
          res.body.message = `Order items with ID ${olists.order_id} deleted`;
          res.statusCode = 200;
        })
        .expect(200, done);
    });
  });

  describe("PUT /account", () => {
    it("update user", (done) => {
      request(app)
        .put("/account")
        .set("Content-Type", "application/json")
        .auth(loggedSeller.seller_id, loggedSeller.seller_zip_code_prefix, {
          type: "basic",
        })
        .send(sellerToUpdate)
        .expect(200, done);
    });
  });
});
