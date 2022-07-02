const comments = require("./api/comments");
const Comment = require("./model/Comment");
const sequelize = require("./model/database");
const Post = require("./model/Post");

//SETUP:
sequelize.sync().then(() => {
  // uncomment each to seed the datbase the way you like!
  // postSeeder must be seeded with at least 50 posts for the test to pass!

  // postSeeder(20);
  //commentSeeder(5, 19); // (num of comments. post_id)

  //1st arg: comments to become subcomments
  //2nd arg: parent comment ID
  subCommentSeeder([67, 63], 62);
});

async function postSeeder(upperLimit, startingNum = 0) {
  const newNum = startingNum + 1;

  let lorem = " = Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin auctor erat enim, eget maximus eros vestibulum a. In eleifend purus leo, ut semper massa mattis vitae. Sed posuere lacus eros, quis egestas sapien porttitor at. Fusce pellentesque, nulla eu tempus luctus, eros elit tristique mauris, et porttitor dui ipsum quis risus. Quisque at faucibus eros. Proin egestas tincidunt mattis. Aenean neque neque, faucibus id fermentum quis, faucibus quis velit. Morbi condimentum dui at felis accumsan, quis vehicula dui blandit. Aliquam et pretium lectus, eget tincidunt ante. In id vehicula elit. Quisque accumsan odio in lorem vulputate, ac gravida tortor porttitor. In odio nulla, mollis ut tortor non, ullamcorper finibus massa. Curabitur varius ante vel ullamcorper lobortis. Maecenas id magna a diam tristique placerat id id arcu. Vestibulum nec viverra urna. Nam sit amet felis mattis enim dignissim auctor. Pellentesque rhoncus pretium nisl, in rhoncus turpis maximus sed. Ut vulputate tellus enim. Etiam id rhoncus velit. Proin velit tellus, tempus eu elit vitae, pulvinar convallis arcu. Vestibulum non urna lacus. Maecenas dignissim semper velit, eget finibus diam tempus nec. Nam eu augue turpis. Integer ultricies a ligula nec imperdiet. Donec nibh mauris, tristique at justo in, vehicula varius libero. Suspendisse potenti. Fusce facilisis vel nisi ac venenatis. Vestibulum eros ante, rhoncus quis diam sit amet, varius aliquam ex. Quisque ut luctus ligula, eu dapibus leo. Vivamus consequat porttitor nunc nec finibus. Praesent sed ante vitae nulla dignissim ultrices id eget nibh. Nullam lorem tortor, pellentesque eu nisl ac, pharetra commodo leo. Pellentesque nec turpis vel nisl facilisis sodales vel ut mi. Vestibulum posuere posuere sapien in hendrerit. Cras ipsum elit, bibendum ac pretium vel, facilisis quis risus. Donec est mauris, tempor nec ex quis, suscipit faucibus dolor. Aliquam iaculis sed ante et mollis. Vivamus arcu tortor, consectetur a odio nec, semper semper turpis. Aenean eget pretium tortor, eget maximus urna. Sed id erat eget ligula venenatis semper. Vivamus metus enim, vestibulum sit amet mattis sed, mollis cursus diam. Donec at quam feugiat eros rhoncus vehicula nec sed lectus. Sed a nisl vel dolor vestibulum molestie. Morbi bibendum lacus sit amet enim rutrum, ut pellentesque odio ultrices. Aenean viverra erat quis ante pretium, sed pellentesque eros hendrerit. Sed a eros quis nulla tincidunt ornare ac varius ante. Mauris dignissim maximus fermentum. Nam varius, felis in tincidunt ornare, mi libero imperdiet enim, quis hendrerit mauris mauris sit amet mi. Nulla blandit malesuada sapien.";
  await Post.create({
    title: "title_" + newNum,
    body: newNum + lorem,
  });

  if (newNum < upperLimit) {
    return postSeeder(upperLimit, newNum);
  }

  return console.log("seeding is done!");
}

async function commentSeeder(upperLimit, postId, startingNum = 0) {
  const newNum = startingNum + 1;

  await Comment.create({
    body: "body_" + newNum,
    post_id: postId,
  });

  if (newNum < upperLimit) {
    return commentSeeder(upperLimit, postId, newNum);
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
