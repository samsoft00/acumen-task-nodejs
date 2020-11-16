import chai, { expect } from "chai";
import { server } from "../server";
import chaiHttp from "chai-http";

chai.use(chaiHttp);

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

describe("User", () => {
  afterAll(async (done) => {
    await server.close();
  });

  beforeAll((done) => {
    // load olist data
    // await OlistRepo.loadData();
    done();
  });

  describe("Update User account /PUT", () => {
    it("update user", (done) => {
      chai
        .request(server)
        .put("/account")
        .set("Content-Type", "application/json")
        .auth(loggedSeller.seller_id, loggedSeller.seller_zip_code_prefix, {
          type: "basic",
        })
        .send(sellerToUpdate)
        .end((err, res) => {
          //   expect(res.body).to.equal(sellerToUpdate);
          expect(res.statusCode).to.equal(200);
          if (err) return done(err);
          done();
        });
    });
  });
});
