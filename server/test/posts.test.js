//Require the dev-dependencies
let chai = require("chai");
let expect = chai.expect;
let chaiHttp = require("chai-http");
let server = require("../index");
let should = chai.should();

chai.use(chaiHttp);

// dev.sqlite is seeded with 50 comments with post_id "1"
// and some subcomments(done separately with seed.js speed up the test)
describe("/posts", () => {
  describe("GET/all posts", () => {
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

  describe("GET/ one post", () => {
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

  xit("POST/ It is possible to post a blog post in post's model", (done) => {
    chai
      .request(server)
      .post("/posts")
      .send({
        title: "title1",
        body: "body1",
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("title").eq("title1");
        res.body.should.have.property("body").eq("body1");
        done();
      });
  });
});
