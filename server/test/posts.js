// process.env.NODE_ENV = "test"; // setting env variable so database will be run off memory and leave the actual db intact!

//Require the dev-dependencies
let chai = require("chai");
let expect = require("chai").expect;
let chaiHttp = require("chai-http");
let server = require("../index");
let should = chai.should();

const sequelize = require("../model/database");
const Post = require("../model/Post");

chai.use(chaiHttp);

describe("/POSTS", () => {
  before("Setup db", (done) => {
    sequelize.sync().then(() => {
      console.log("test db is ready on memory");
      done();
    });
  });

  describe("GET", () => {
    it("Call to datbase should receive status 200 with an array in the body", (done) => {
      chai
        .request(server)
        .get("/posts")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.posts.should.be.a("array");
          done();
        });
    });
    it("If no query is passed receive last 10 posts, in descending fashion with total page numbers!", (done) => {
      chai
        .request(server)
        .get("/posts")
        .end((err, res) => {
          expect(res.body.posts).to.have.lengthOf(10);
        //   console.log(res.body)
        //   console.log(res.body.totalPages)
            expect(res.body.posts[0].id).to.be.above(res.body.posts[9].id);
            res.body.totalPages.should.be.a("number");
          done();
        });
    });
    it("passing page query with value of number 2 should give us posts from the requested page", (done) => {
        
        chai
        .request(server)
        .get("/posts?page=2")
        .end((err, res) => {
          console.log(res.body.totalPages)
          console.log(res.body.posts)
          expect(res.body.posts[0].id).to.be.above(40);
          expect(res.body.posts[9].id).to.be.below(40);
          done();
        });
    })
        
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
