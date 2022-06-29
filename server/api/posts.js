const posts = require("express").Router();
const Post = require("../model/Post");
const User = require("../model/User");

posts.get("/", async (req, res) => {
    const posts = await Post.findAll();
    res.send(posts);
})

posts.post("/", async (req, res) => {
    // body must contain: { title, body, user_id } 
     const post = await Post.create(req.body)
     res.send(post);
})

posts.put("/:postId", async (req, res) => {
    // body must contain: { title, body, user_id } 
    const postId = req.params.postId;
    const post = await Post.findOne({ where : { id: postId }});
    
    Object.keys(req.body).forEach(key => {
        post[key] = req.body[key];
      });

    await post.save();
    res.send(post);
      
});

posts.delete("/:postId", async (req, res) => {
    const postId = req.params.postId;
    await Post.destroy({ where: { id: postId }});
    res.send('removed');
})
module.exports = posts;


//TODO: 
    // refactor using DRY
    // start testing and continue with TDD
