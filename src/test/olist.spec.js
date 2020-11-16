import chai, { expect } from "chai";
import { server } from "../server";
import chaiHttp from "chai-http";

import OlistRepo from "../repos/olist.repo";

chai.use(chaiHttp);

const loggedUser = {
  seller_id: "d1b65fc7debc3361ea86b5f14c68d2e2",
  seller_zip_code_prefix: "13844",
};

let olists = null;

describe("Olist", () => {
  afterAll(async (done) => {
    // await OlistRepo.dropDatabase();
    await server.close();
  });

  beforeAll((done) => {
    // load olist data
    // await OlistRepo.loadData();
    done();
  });

  describe("Fetch Olist order items /GET", () => {
    it("throw error if basic auth is wrong", (done) => {
      chai
        .request(server)
        .get("/order_items")
        .set("Content-Type", "application/json")
        .auth(loggedUser.seller_id, "12855", {
          type: "basic",
        })
        .end((err, res) => {
          expect(res.body.message).to.equal(
            "Invalid Authentication Credentials"
          );
          expect(res.statusCode).to.equal(401);
          if (err) return done(err);
          done();
        });
    });

    it("fetch olist order items", (done) => {
      chai
        .request(server)
        .get("/order_items")
        .set("Content-Type", "application/json")
        .auth(loggedUser.seller_id, loggedUser.seller_zip_code_prefix, {
          type: "basic",
        })
        .end((err, res) => {
          olists = res.body.data[0];
          expect(res.statusCode).to.equal(200);
          if (err) return done(err);
          done();
        });
    });
  });

  describe("Fetch Olist items by order_id /GET", () => {
    it("get Olist items by order_id", (done) => {
      chai
        .request(server)
        .delete(`/order_items/${olists.order_id}`)
        .set("Content-Type", "application/json")
        .auth(loggedUser.seller_id, loggedUser.seller_zip_code_prefix, {
          type: "basic",
        })
        .end((err, res) => {
          expect(res.body.message).to.equal(
            `Order items with ID ${olists.order_id} deleted`
          );
          expect(res.statusCode).to.equal(200);
          if (err) return done(err);
          done();
        });
    });
  });
});
