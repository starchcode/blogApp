const posts = require("express").Router();
const Post = require("../model/Post");

posts.param('postId', async (req, res, next, postId) => {
  console.log('postId requested is', postId);
  const post = await Post.findOne({ where: { id: postId}});
  req.body.post = post;
  next();
});

posts.get("/", async (req, res) => {
  const limit = 10;
  const page = req.query.page;
  let totalPages = Math.ceil((await Post.count()) / limit); // round up
  let posts;
  
  if (page === undefined) {
    posts = await Post.findAll({
      order: [["id", "DESC"]],
      limit: 10,
    });
  } else if (page > 0 && page <= totalPages) {
    posts = await Post.findAll({
      order: [["id", "DESC"]],
      limit: 10,
      offset: limit * (page - 1),
    });
  } else {
    // in case page does not exist
    return res
      .status(404)
      .send({
        posts: [],
        totalPages: totalPages,
        error: "Page does not exist!",
      });
  }

  res.status(200).json({ posts: posts, totalPages: totalPages });
});


posts.get("/:postId", async (req, res, next) => {
res.send(req.body.post);
})


posts.post("/", async (req, res) => {
  if(!req.body.title || !req.body.body) return res.sendStatus(422); 
  const post = await Post.create(req.body);
  res.status(201).json({post: post});
});

posts.put("/:postId", async (req, res) => {
  // body must contain: { title, body, user_id }
  if(!req.body.post) return res.sendStatus(404);
  if(!req.body.title || !req.body.body) return res.statusCode(501)
  // const postId = req.params.postId;
  // const post = await Post.findOne({ where: { id: postId } });

  Object.keys(req.body).forEach((key) => {
    req.body.post[key] = req.body[key];
  });

  await req.body.post.save();
  res.sendStatus(204);
});

posts.delete("/:postId", async (req, res) => {
  if(!req.body.post) return res.sendStatus(404);
  await Post.destroy({ where: { id: req.body.post.id } });
  res.sendStatus(204);
});

module.exports = posts;

//TODO:
// refactor using DRY
