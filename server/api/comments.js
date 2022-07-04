const comments = require("express").Router();
const Comment = require("../model/Comment");

comments.get("/:postId", async (req, res) => {
  const limit = 10;
  const page = req.query.page;
  const postId = req.params.postId;
  let comments;

  const totalPages = Math.ceil(
    (await Comment.count({
      where: { post_id: postId, parent_comment_id: null },
    })) / limit
  );
  console.log(totalPages);
  // page queries
  if (page === undefined) {
    comments = await Comment.findAll({
      raw: true,
      where: { post_id: postId, parent_comment_id: null },
      order: [["id", "DESC"]],
      limit: 10,
    });
  } else if (page > 0 && page <= totalPages) {
    comments = await Comment.findAll({
      raw: true,
      where: { post_id: postId, parent_comment_id: null },
      order: [["id", "DESC"]],
      limit: 10,
      offset: limit * (page - 1),
    });
  } else if (totalPages === 0) {
    comments = [];
  } else {
    // in case page does not exist
    return res.status(404).send({
      comments: [],
      totalPages: totalPages,
      error: `Page ${page} does not exist!`,
    });
  }

  // Attach subComments as an Array
  commentsWithSubComments = await Promise.all(
    comments.map(async (comment) => {
      comment.subComments = await Comment.findAll({
        where: { post_id: postId, parent_comment_id: comment.id },
      });
      return comment;
    })
  );

  res
    .status(200)
    .json({ comments: commentsWithSubComments, totalPages: totalPages });
});

comments.param("postId", async (req, res, next, postId) => {
  console.log("postId requested is", postId);
  const post = await Comment.findOne({ where: { id: postId } });
  req.body.comment = post;
  next();
});

comments.post("/", async (req, res) => {
  if (!req.body.body) return res.sendStatus(422);
  const comment = await Comment.create(req.body);
  res.status(201).json({ comment: comment });
});

comments.put("/:postId", async (req, res) => {
  if (!req.body.comment) return res.sendStatus(404);
  if (!req.body.body) return res.statusCode(501);

  Object.keys(req.body).forEach((key) => {
    req.body.comment[key] = req.body[key];
  });

  await req.body.comment.save();
  res.sendStatus(204);
});


comments.delete("/:postId", async (req, res) => {
  if(!req.body.comment) return res.sendStatus(404);
  await Comment.destroy({ where: { id: req.body.comment.id } });
  await Comment.destroy({ where: { parent_comment_id: req.body.comment.id } });
  res.sendStatus(204);
});

module.exports = comments;
