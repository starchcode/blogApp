const sequelize = require("./model/database");
const Post = require("./model/Post");

//SETUP:
sequelize.sync().then(() => {
  postSeeder(50);
});

async function postSeeder(upperLimit, startingNum = 0) {
  const newNum = startingNum + 1 ;

  console.log(newNum);

    await Post.create(
    {
        "title": "title_" + newNum,
        "body": "body_" + newNum,
        "user_id": "1"
    }
  );

  if (newNum < upperLimit) {
    return postSeeder(upperLimit, newNum);
  }

  return console.log('seeding is done!');
}

async function commentSeeder(upperLimit, startingNum = 0) {
    const newNum = startingNum + 1 ;
  
    console.log(newNum);
  
      await Post.create(
      {
          "title": "title_" + newNum,
          "body": "body_" + newNum,
          "user_id": "1"
      }
    );
  
    if (newNum < upperLimit) {
      return commentSeeder(upperLimit, newNum);
    }
  
    return console.log('seeding is done!');
  }
  
  module.exports = {postSeeder, commentSeeder}