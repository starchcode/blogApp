const comments = require("./api/comments");
const Comment = require("./model/Comment");
const sequelize = require("./model/database");
const Post = require("./model/Post");

//SETUP:
sequelize.sync().then(() => {
  // uncomment each to seed the datbase the way you like!
  // postSeeder must be seeded with at least 50 posts for the test to pass!

  // postSeeder(50);
  // commentSeeder(50);

  //1st arg: comments to become subcomments
  //2nd arg: parent comment ID
  // subCommentSeeder([41, 42, 43, 44, 45], 2);
});

async function postSeeder(upperLimit, startingNum = 0) {
  const newNum = startingNum + 1;

  await Post.create({
    title: "title_" + newNum,
    body: "body_" + newNum,
  });

  if (newNum < upperLimit) {
    return postSeeder(upperLimit, newNum);
  }

  return console.log("seeding is done!");
}

async function commentSeeder(upperLimit, startingNum = 0) {
  const newNum = startingNum + 1;

  await Comment.create({
    body: "body_" + newNum,
    post_id: 1,
  });

  if (newNum < upperLimit) {
    return commentSeeder(upperLimit, newNum);
  }

  return console.log("seeding is done!");
}

async function subCommentSeeder(subComments, parentCommentId, startingNum = 0) {
  const index = startingNum + 1;

  const comment = await Comment.findOne({
    where: { id: subComments[index - 1], parent_comment_id: null },
  });
  comment.parent_comment_id = parentCommentId;
  await comment.save();

  if (index < subComments.length) {
    return subCommentSeeder(subComments, parentCommentId, index);
  }

  return console.log("seeding is done!");
}
