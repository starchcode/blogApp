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
  } else {
    // in case page does not exist
    return res.status(404).send({
      comments: [],
      totalPages: totalPages,
      error: `Page ${page} does not exist!`,
    });
  }

  // Attach subComments as an Array
  commentsWithSubComments = await Promise.all(comments.map(async comment => {
    comment.subComments = await Comment.findAll({
        where: { post_id: postId, parent_comment_id: (comment.id) }
    });
    return comment;
  }));


  res.status(200).json({ comments: commentsWithSubComments, totalPages: totalPages });
});

module.exports = comments;
