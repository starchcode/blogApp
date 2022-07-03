//Require the dev-dependencies
let chai = require("chai");
let expect = chai.expect;
let chaiHttp = require("chai-http");
let should = chai.should();
let server = require("../index");

const sequelize = require("../model/database");
const Comment = require("../model/Comment");

chai.use(chaiHttp);

// dev.sqlite is seeded with 50 comments with post_id "1"
// and some subcomments(done separately with seed.js speed up the test)
describe("/comments/:postId", () => {
  before((done) => {
    sequelize.sync().then(() => {
      done();
    });
  });

  describe("GET/", () => {
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

  describe("POST/", () => {
    let result;

    afterEach((done) => {
      if (result.body.comment) {
        Comment.destroy({ where: { id: result.body.comment.id } }).then(() =>
          done()
        );
      } else {
        done();
      }
    });

    it("It is possible to post a comment to a blog post", (done) => {
      try {
        chai
          .request(server)
          .post("/comments")
          .send({
            body: "body_test",
          })
          .end((err, res) => {
            result = res;
            console.log("===> ", result.body.comment);
            result.should.have.status(201);
            result.body.comment.should.have.property("body").eq("body_test");
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
          .post("/comments")
          .send({})
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


  describe("PUT:", () => {
    let body;

    before((done) => {
      Comment.findOne({ raw: true, where: { id: 1 } }).then((data) => {
        body = data;
        done();
      });
    });

    afterEach((done) => {
      Comment.findOne({ where: { id: 1 } }).then((data) => {
        data.set({
          body: body.body,
        });
        data.save().then(() => done());
      });
    });

    it("Should be able to update a comment with ID of 1 and receive 204", (done) => {
      chai
        .request(server)
        .put("/comments/1")
        .send({
          body: "body_UPDATED",
        })
        .end((err, res) => {
          res.should.have.status(204);
          Comment.findOne({ where: { id: 1 } }).then((data) => {
            // console.log("===> ", data.title);
            try {
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
        .put("/comments/999")
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
      Comment.create({ body: "toDELETE" })
      .then((newPost) => {
        toDeleteId = newPost.id;
        done();
      });
    });

    it("A post can be deleted and receive 204 status code", (done) => {
      chai
        .request(server)
        .delete("/comments/" + toDeleteId)
        .end((err, res) => {
          res.should.have.status(204);
          done();
        });
    });

    it("If entry does not exist receive 404", (done) => {
      chai
      .request(server)
      .delete("/comments/999")
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
    })
    
  });
  
});
