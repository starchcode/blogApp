let chai = require("chai");
let expect = chai.expect;
let chaiHttp = require("chai-http");
let server = require("../index");
let should = chai.should();

const sequelize = require("../model/database");
const { request } = require("chai");
const Post = require("../model/Post");

chai.use(chaiHttp);

// dev.sqlite is seeded with 50 comments with post_id "1"
// and some subcomments(done separately with seed.js speed up the test)
describe("/posts", () => {
  before((done) => {
    sequelize.sync().then(() => {
      done();
    });
  });
  describe("GET/ all posts", () => {
    it("If no page query is passed,  receive last 10 posts, in descending fashion with total pages!", (done) => {
      chai
        .request(server)
        .get("/posts")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.posts.should.be.a("array");
          expect(res.body.posts).to.have.lengthOf(10);
          expect(res.body.posts[0].id).to.be.above(res.body.posts[9].id);
          res.body.totalPages.should.be.a("number");
          done();
        });
    });

    it("if page does not exist attach an error message'Page does not exist!'", (done) => {
      chai
        .request(server)
        .get("/posts?page=6")
        .end((err, res) => {
          res.should.have.status(404);
          expect(res.body.error).to.eql("Page does not exist!");
          done();
        });
    });

    it("passing page query with value of number 2 should give us posts from the requested page", (done) => {
      chai
        .request(server)
        .get("/posts?page=2")
        .end((err, res) => {
          expect(res.body.posts[0].id).to.be.eq(40);
          expect(res.body.posts[9].id).to.be.eq(31);
          done();
        });
    });
  });

  describe("GET/: one post", () => {
    it("should recieve the post with passed /:postId", (done) => {
      chai
        .request(server)
        .get("/posts/1")
        .end((err, res) => {
          expect(res.body.id).to.be.eq(1);
          done();
        });
    });

    it("should recieve undefined if /:postId does not exist", (done) => {
      chai
        .request(server)
        .get("/posts/900")
        .end((err, res) => {
          expect(res.body.id).to.be.undefined;
          done();
        });
    });
  });

  describe("POST:postId", () => {
    let result;

    afterEach((done) => {
      if (result.body.post) {
        Post.destroy({ where: { id: result.body.post.id } }).then(() => done());
      } else {
        done();
      }
    });

    it("It is possible to post a blog post in Post's model", (done) => {
      try {
        chai
          .request(server)
          .post("/posts")
          .send({
            title: "title_test",
            body: "body_test",
          })
          .end((err, res) => {
            result = res;

            result.should.have.status(201);
            result.body.post.should.have.property("title").eq("title_test");
            result.body.post.should.have.property("body").eq("body_test");
            done();
          });
      } catch (e) {
        done(e);
      }
    });

    it("TITLE property must be attached to request", (done) => {
      try {
        chai
          .request(server)
          .post("/posts")
          .send({
            body: "body_test",
          })
          .end((err, res) => {
            result = res;
            result.should.have.status(422);
            done();
          });
      } catch (e) {
        done(e);
      }
    });
    it("BODY property must be attached to request", (done) => {
      try {
        chai
          .request(server)
          .post("/posts")
          .send({
            title: "title_test",
          })
          .end((err, res) => {
            result = res;
            result.should.have.status(422);
            done();
          });
      } catch (e) {
        done(e);
      }
    });
  });

  describe("PUT/:postId", () => {
    let body;

    before((done) => {
      Post.findOne({ raw: true, where: { id: 1 } }).then((data) => {
        body = data;
        done();
      });
    });
    afterEach((done) => {
      Post.findOne({ where: { id: 1 } }).then((data) => {
        data.set({
          title: body.title,
          body: body.body,
        });
        data.save().then(() => done());
      });
    });

    it("Should be able to update a post with ID of 1 and receive 204", (done) => {
      chai
        .request(server)
        .put("/posts/1")
        .send({
          title: "title_UPDATED",
          body: "body_UPDATED",
        })
        .end((err, res) => {
          res.should.have.status(204);
          Post.findOne({ where: { id: 1 } }).then((data) => {
            console.log("===> ", data.title);
            try {
              expect(data.title).to.equal("title_UPDATED");
              expect(data.body).to.equal("body_UPDATED");
              done();
            } catch (e) {
              done(e);
            }
          });
        });
    });

    it("Requested post must exist", (done) => {
      chai
        .request(server)
        .put("/posts/999")
        .send({
          title: "title_UPDATED",
          body: "body_UPDATED",
        })
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  describe("DELETE/:postId", () => {
    //204
    let toDeleteId;
    before((done) => {
      Post.create({ title: "toDELETE", body: "toDELETE" }).then((newPost) => {
        toDeleteId = newPost.id;
        done();
      });
    });

    // after((done) => {
    //   if (toDeleteId) {
    //     Post.destroy({ where: { id: toDeleteId } });
    //   }
    // });

    it("A post can be deleted and receive 204 status code", (done) => {
      chai
        .request(server)
        .delete("/posts/" + toDeleteId)
        .end((err, res) => {
          res.should.have.status(204);
          done();
        });
    });

    it("If entry does not exist receive 404", (done) => {
      chai
      .request(server)
      .delete("/posts/999")
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
    })
    
  });
});
