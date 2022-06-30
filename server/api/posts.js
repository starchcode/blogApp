const posts = require("express").Router();
const Post = require("../model/Post");
const User = require("../model/User");

posts.get("/", async (req, res) => {
  //?page=2&limit=3
  console.log(req.query.page);
  const limit = 10;
  const page = req.query.page;
  let totalPages = Math.ceil((await Post.count()) / limit); // round up

  let posts;
  if (page === undefined) {
    posts = await Post.findAll({
      order: [["id", "DESC"]],
      limit: 10,
    });
  }else if(page > 0 && page <= totalPages){
    posts = await Post.findAll({
        order: [["id", "DESC"]],
        limit: 10,
        offset: limit * (page - 1)
      });
  }
  //TODO:  Next passing a page that does not exist!!

  res.status(200).json({ posts: posts, totalPages: totalPages });
});

posts.post("/", async (req, res) => {
  // body must contain: { title, body, user_id }
  const post = await Post.create(req.body);
  res.send(post);
});

posts.put("/:postId", async (req, res) => {
  // body must contain: { title, body, user_id }
  const postId = req.params.postId;
  const post = await Post.findOne({ where: { id: postId } });

  Object.keys(req.body).forEach((key) => {
    post[key] = req.body[key];
  });

  await post.save();
  res.send(post);
});

posts.delete("/:postId", async (req, res) => {
  const postId = req.params.postId;
  await Post.destroy({ where: { id: postId } });
  res.send("removed");
});
module.exports = posts;

//TODO:
// refactor using DRY
// start testing and continue with TDD
