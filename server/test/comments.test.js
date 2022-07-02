//Require the dev-dependencies
let chai = require("chai");
let expect = chai.expect;
let chaiHttp = require("chai-http");
let should = chai.should();
let server = require("../index");

chai.use(chaiHttp);

// dev.sqlite is seeded with 50 comments with post_id "1"
// and some subcomments(done separately with seed.js speed up the test)
describe("/comments/:postId", () => {
  describe("GET", () => {
    it("If postId does not have any comments show an empty array with totalPages property of '0'. ", (done) => {
      chai
        .request(server)
        .get("/comments/399")
        .end((err, res) => {
          expect(res.body.totalPages).to.be.eq(0);
          expect(res.body.comments).to.have.lengthOf(0);
          done();
        });
    });

    it("If page query is NOT passed, receive last 10 comments of post_id=1, in descending fashion and with NUMBER of total pages", (done) => {
      chai
        .request(server)
        .get("/comments/1")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.comments.should.be.a("array");
          expect(res.body.comments).to.have.lengthOf(10);
          expect(res.body.comments[0].id).to.be.above(res.body.comments[9].id);

          isParentComment = res.body.comments.every((comment) => {
            return comment.parent_comment_id === null;
          });
          expect(isParentComment).to.be.true;
          res.body.totalPages.should.be.a("number");

          done();
        });
    });

    it("passing page query with value of number 2 should give us post's comments from the requested page", (done) => {
      chai
        .request(server)
        .get("/comments/1?page=2") //ensure there is 40 parent comments exactly in dev.sqlite!
        .end((err, res) => {
          expect(res.body.comments[0].id).to.be.eq(30);
          expect(res.body.comments[9].id).to.be.eq(21);
          done();
        });
    });

    it("Received comments must have a property called subComments", (done) => {
      chai
        .request(server)
        .get("/comments/1") //ensure there is 40 parent comments exactly in dev.sqlite!
        .end((err, res) => {
          const allAreArray = res.body.comments.every((comment) =>
            Array.isArray(comment.subComments)
          );
          expect(allAreArray).to.be.true;
          done();
        });
    });

    it("50th comment to have 5 subComments", (done) => {
        chai
        .request(server)
        .get("/comments/1?page=4") //ensure last comment has 5 sub comments in dev.sqlite!
        .end((err, res) => {
          expect(res.body.comments[9].subComments).to.have.lengthOf(5);
          done();
        });  
    });

    it("if page does not exist receive an error message: 'Page 'notExistingPageNumber' does not exist!'", (done) => {
      const pageNum = 6;
      chai
        .request(server)
        .get("/comments/1?page=" + pageNum)
        .end((err, res) => {
          res.should.have.status(404);
          expect(res.body.error).to.eql(`Page ${pageNum} does not exist!`);
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
